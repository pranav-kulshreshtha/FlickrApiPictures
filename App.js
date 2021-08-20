import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, FlatList,
          Image } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TooManyRequests } from 'http-errors';

let button_ripple = {
  borderless: true,
  color: 'white',
  radius: 60,
}

export default class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isLoadingMain: true,
      isLoadingMore: false,
      picData: [],
      page: 1
    }
  }; 

  componentDidMount = ()=>{
    const init_url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=4a48faf09b9c6370923746614e3ca53f&per_page=50&page='
      +this.state.page+'&format=json&nojsoncallback=1'
    return fetch(init_url).then((response)=> response.json() ).then((resJSON)=> {
      this.setState({
        picData: resJSON.photos.photo,
        isLoadingMain: false
      })
      //console.log(resJSON);
      //console.log("Fetched data size now : "+this.state.picData.length); 
    } )
    .catch((error)=>{console.log(error)});
  };

  showData = (item)=>{
    //console.log(item)
    const photo = item.item;
    return (
      <Image source={{uri:`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}}
        style={{height:200, width:'48%',margin:'1%'}}/>
    );
  };

  render()
  {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor={'#ff9900'}/>
      <View style={styles.header}>
        <Text style={styles.title}>Flickr photos</Text>
        <Pressable android_ripple={button_ripple}>
          <FontAwesome name="search" size={26} color={'white'}/>
        </Pressable>
      </View>
      <View style={styles.body}>
        {
          !this.state.isLoadingMain ? 
        <FlatList data={this.state.picData} keyExtractor={(item)=>{return item.id}} 
            renderItem={this.showData} numColumns={2}/>
          : <ActivityIndicator size={'large'} color={'gray'}/>
        }
      </View>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    //borderColor:'red',
    //borderWidth: 2,
  },
  title:{
    fontSize: 32,
    fontWeight: 'bold',
    textAlign:'center',
    textAlignVertical: 'center',
    color: 'white',
    marginHorizontal: 45,
  },
  header: {
    flex:1,
    backgroundColor: 'orange',
    height: '100%',
    width: '100%',
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 3,
  },
  body: {
    flex: 9,
    //borderWidth: 2,
    justifyContent:'center',
    width: '100%',
  },
});
