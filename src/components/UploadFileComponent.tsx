/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Modal, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Attachment} from '../models/TaskModel';
import {DocumentCloud} from 'iconsax-react-native';
import {colors} from '../constants/colors';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import TextComponent from './TextComponent';
import {GlobalStyles} from '../styles/GlobalStyles';
import TitleComponent from './TitleComponent';
import Space from './Space';
import {calcFileSize} from '../utils/calclFileSize';
import {Slider} from '@miblanchard/react-native-slider';
import Row from './Row';
import storage from '@react-native-firebase/storage';

interface Props {
  onUpload: (file: Attachment) => void;
}

const UploadFileComponent = (props: Props) => {
  const {onUpload} = props;
  const [file, setFile] = useState<DocumentPickerResponse>();
  const [isVisible, setIsVisible] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [attachmentFile, setAttachmentFile] = useState<Attachment>();

  useEffect(() => {
    file && handleUploadFileToStorage();
  }, [file]);

  useEffect(() => {
    if (!attachmentFile) {
      return;
    }
    onUpload(attachmentFile);
    setIsVisible(false);
    setProgressUpload(0);
    setAttachmentFile(undefined);
  }, [attachmentFile]);

  const handleUploadFileToStorage = () => {
    if (!file) {
      return;
    }
    setIsVisible(true);

    const path = `/documents/${file.name}`;

    const res = storage().ref(path).putFile(file.uri);

    res.on('state_changed', task => {
      setProgressUpload(task.bytesTransferred / task.totalBytes);
    });

    res.then(() => {
      storage()
        .ref(path)
        .getDownloadURL()
        .then(url => {
          const data: Attachment = {
            name: file.name ?? '',
            url,
            size: file.size ?? 0,
          };

          setAttachmentFile(data);
        });
    });

    res.catch(error => console.log(error.message));
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          DocumentPicker.pick({
            allowMultiSelection: false,
            type: [
              'application/pdf',
              DocumentPicker.types.doc,
              DocumentPicker.types.xls,
            ],
          })
            .then(res => {
              setFile(res[0]);
            })
            .catch(error => console.error(error))
        }>
        <DocumentCloud size={24} color={colors.white} />
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        statusBarTranslucent
        animationType="slide"
        style={{flex: 1}}
        transparent>
        <View
          style={[
            GlobalStyles.container,
            {
              backgroundColor: `${colors.gray2}80`,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            },
          ]}>
          <View
            style={{
              margin: 20,
              width: Dimensions.get('window').width * 0.8,
              height: 'auto',
              padding: 12,
              borderRadius: 20,
              backgroundColor: colors.white,
            }}>
            <TitleComponent
              text="Uploading..."
              color={colors.bgColor}
              flex={0}
            />
            <Space height={12} />
            <View>
              <TextComponent
                flex={0}
                text={file?.name}
                color={colors.bgColor}
              />
              <TextComponent
                flex={0}
                text={`${calcFileSize(file?.size as number)}`}
                size={12}
                color={colors.gray2}
              />
            </View>
            <Row>
              <View style={{flex: 1, marginRight: 12}}>
                <Slider
                  disabled
                  value={progressUpload}
                  renderThumbComponent={() => null}
                  trackStyle={{height: 6, borderRadius: 100}}
                  minimumTrackTintColor={colors.success}
                  maximumTrackTintColor={colors.desc}
                />
              </View>
              <TextComponent
                text={`${Math.floor(progressUpload) * 100}%`}
                color={colors.bgColor}
                flex={0}
              />
            </Row>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UploadFileComponent;
