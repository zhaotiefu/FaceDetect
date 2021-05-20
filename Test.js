import SplashScreen from 'react-native-splash-screen'
import React, { useEffect, createRef,useState } from 'react';
import { SafeAreaView, View, Image, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';


const Test = (props) => {

  useEffect(() => {
    SplashScreen.hide();
  });


  const [faces, setFace] = useState([]);
  const [faceavl, setFaceavl] = useState(false);
  const [takeTimeFaceAvl, setTakeTimeFaceAvl] = useState(false);
  const [searchWaiting, setsearchWaiting] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);


  const mycamera = createRef()


  const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );


  const renderFaces = () => (
    <View style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
    }} pointerEvents="none">
      {faces.map(renderFace)}
    </View>
  );

  const renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
    <View
      key={faceID}
      transform={[
        { perspective: 600 },
        { rotateZ: `${rollAngle.toFixed(0)}deg` },
        { rotateY: `${yawAngle.toFixed(0)}deg` },
      ]}
      style={[
        {
          padding: 10,
          borderWidth: 1,
          borderRadius: 2,
          position: 'absolute',
          borderColor: '#000',
          justifyContent: 'center',
        },
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}
    >

    </View>
  );


  return (
    <>
      <SafeAreaView style={styles.container}>

        <RNCamera
          ref={mycamera}

          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}

          faceDetectorEnabled={true}
          onFacesDetected={(data) => {
            setFace(data.faces)
            setFaceavl(true);
            clearTimeout(searchWaiting)
            const avc = setTimeout(() => {
              console.log()
              setFaceavl(false);
              setFace([])
            }, 500)
            setsearchWaiting(avc)
          }}
          onFaceDetectionError={(error) => {
            console.log('face--detact-->', error)
          }}


        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={async () => {
                  const options = { quality: 0.5, base64: true };
                  const data = await camera.takePictureAsync(options)
                  if (faceavl) {
                    setTakeTimeFaceAvl(true)
                  } else {
                    setTakeTimeFaceAvl(false)
                  }
                  console.log(data.uri)
                  setImage(data)
                  setModalVisible(!modalVisible)
                }} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
              </View>
            );
          }}

        </RNCamera>
        {faces ? renderFaces() : null}
      </SafeAreaView>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {takeTimeFaceAvl ? image ? <Image
              style={{
                width: 200,
                height: 100,
              }}
              source={{
                uri: image.uri,
              }}
            /> : null : <Text>Face not found</Text>}
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  item: {
    backgroundColor: '#FFF',
  },
  viewOne: {
    flexDirection: 'row'
  },
  viewTwo: {
    alignItems: 'flex-end', marginEnd: 9
  },
  title: {
    fontSize: 16, // Semibold #000000
    color: '#000000',
  },
  noOff: {
    color: '#D65D35',
    fontSize: 20,  // Semibold
  }, product: {
    color: '#A6A6A6',
    fontSize: 16,  // Regular
  }, titleView: {
    flex: 1,
    alignSelf: 'center',
    marginStart: 14,
    marginEnd: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});