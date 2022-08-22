import {
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {login} from '../reducers';
import {useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Layout, Text, Input, Icon, Button} from '@ui-kitten/components';
import {db} from '../../firebase';
import {PageLoader} from './PageLoader';
import {connect, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';

const SearchIcon = props => <Icon {...props} name="search" />;

const SelectDoctor = ({navigation, route}) => {
  const authUser = useSelector(state => state.auth);
  const UserDetails1 = authUser.user;
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [myDoctor, setMyDoctor] = useState('');
  const [loading, setLoading] = React.useState(false);
  const handleUpdate = myDoctor => {
    setLoading(true);
    db.collection('usersCollections')
      .doc(UserDetails1.id)
      .update({myDoctor: myDoctor});
    db.collection('usersCollections')
      .doc(UserDetails1.id)
      .get()
      .then(function (user) {
        var userdetails = {...user.data(), id: UserDetails1.id};
        dispatch(login(userdetails));
        setLoading(false);
        navigation.navigate('BottomNavigator');
      })
      .catch(function (error) {
        setLoading(false);
        console.log('Error getting documents: ', error);
      });
  };
  const loadDoctors = () => {
    setLoading(true);
    db.collection('usersCollections')
      .where('role', '==', 'doctor')
      .get()
      .then(querySnapshot => {
        const availdoctors = [];
        querySnapshot.forEach(doc => {
          var newDoc = {
            index: doc.id,
            name: doc.data().fullname,
            designation: doc.data().designation,
            image: require('../../assets/user2.png'),
          };
          availdoctors.push(newDoc);
        });
        setDoctors(availdoctors);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('Error getting documents: ', error);
      });
  };
  useEffect(() => {
    loadDoctors();
  }, []);
  return loading ? (
    <PageLoader />
  ) : (
    <Layout style={styles.Container}>
      <Layout style={styles.topHead}>
        <Icon
          style={styles.arrow}
          fill="#0075A9"
          name="arrow-back"
          onPress={() => navigation.navigate('PSetting')}
        />
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Recoleta-Bold',
            marginLeft: 10,
            marginBottom: 40,
            marginTop: 40,
            right: 140,
          }}>
          Back to Settings
        </Text>
      </Layout>
      <Text style={styles.DrTeaxt}>{UserDetails1.fullname}</Text>
      <Layout style={styles.Search}>
        <Input
          placeholder="Search...."
          accessoryRight={SearchIcon}
          style={styles.input}
          size="large"
        />
      </Layout>
      <Text style={styles.pText}>Select Your Doctor</Text>

      <ScrollView width="100%" showsVerticalScrollIndicator={false}>
        <Layout style={{width: '100%'}}>
          <SafeAreaView>
            <FlatList
              style={styles.textStyle}
              keyExtractor={key => {
                return key.index;
              }}
              vertical
              //inverted
              extraData={doctors}
              showsVerticalScrollIndicator={false}
              data={doctors}
              renderItem={({item}) => {
                return (
                  <>
                    <Layout style={styles.card}>
                      <Image
                        source={item.image}
                        resizeMode="cover"
                        style={{
                          height: 55,
                          width: 55,
                          borderRadius: 50,
                          marginTop: 5,
                        }}
                      />
                      <Text style={styles.text}>{item.name}</Text>
                      <Text style={styles.msg}>{item.designation}</Text>
                      <Text
                        style={styles.details}
                        onPress={() => handleUpdate(item.index)}>
                        Select Now
                      </Text>
                      <Text
                        style={styles.msgNow}
                        onPress={() => navigation.navigate('PSetting')}>
                        Cancel
                      </Text>
                    </Layout>
                  </>
                );
              }}
            />
          </SafeAreaView>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

export default SelectDoctor;

const styles = StyleSheet.create({
  Container: {
    height: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  topHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 65,
    height: 65,
    marginTop: 25,
    borderRadius: 50,
  },
  button: {
    marginTop: 5,
    backgroundColor: '#0075A9',
    width: 200,
    borderColor: 'transparent',
  },
  DrTeaxt: {
    fontSize: 28,
    fontFamily: 'Recoleta-Bold',
    color: '#0075A9',
  },
  Search: {
    marginTop: 30,
  },
  input: {
    borderRadius: 30,
    fontFamily: 'GTWalsheimPro-Regular',
  },
  pText: {
    fontSize: 22,
    marginTop: 25,
    fontFamily: 'Recoleta-Bold',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9F9F9',
    width: '100%',
    marginTop: 15,
    padding: 15,
    paddingBottom: 20,
  },
  text: {
    position: 'absolute',
    marginTop: 10,
    marginLeft: 90,
    fontSize: 20,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msg: {
    position: 'absolute',
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 90,
    color: '#D5D5D5',
    fontSize: 16,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  noti: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#FF6969',
    color: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    paddingTop: 4,
    textAlign: 'center',
    fontSize: 15,
    marginTop: -10,
  },
  details: {
    marginTop: 5,
    marginHorizontal: 75,
    fontSize: 16,
    color: '#0075A9',
    fontFamily: 'GTWalsheimPro-Bold',
  },
  msgNow: {
    position: 'absolute',
    bottom: 20,
    right: 29,
    fontSize: 16,
    fontFamily: 'GTWalsheimPro-Bold',
  },
  bottomButton: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 30,
    top: 50,
  },
  cancel: {
    width: 150,
    backgroundColor: '#0F7BAB',
    borderColor: '#0F7BAB',
  },
  save: {
    width: 150,
    backgroundColor: '#0F7BAB',
    borderColor: '#0F7BAB',
    left: 30,
  },
  arrow: {
    width: 30,
    height: 30,
  },
});
