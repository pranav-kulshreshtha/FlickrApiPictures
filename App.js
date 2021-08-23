import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, FlatList,
          Image, ToastAndroid, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TooManyRequests } from 'http-errors';
import { SearchBar } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';

let button_ripple = {
  borderless: true,
  color: 'white',
  radius: 60,
}

export default class Home extends React.Component{

  constructor(props){
    console.log("\n")
    onEndReachedCalledDuringMomentum = true;
    super(props);
    this.state = {
      isLoadingMain: true,
      isLoadingMore: false,
      picData: [],
      page: 1,
      searchOn: false,
      searchQuery: '',
    }
  }; 

  loadData = () => {
    console.log("Loading page : "+this.state.page);
    const init_url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=4a48faf09b9c6370923746614e3ca53f&per_page=20&page='
      +this.state.page+'&format=json&nojsoncallback=1'
    return fetch(init_url).then((response)=> response.json() ).then((resJSON)=> {
      this.setState({
        picData:  this.state.picData.concat(resJSON.photos.photo),
        isLoadingMain: false,
        isLoadingMore: false,
      })
      console.log("Size of this page : "+resJSON.photos.photo.length);
      console.log("Fetched data size now : "+this.state.picData.length); 
    } )
    .catch((error)=>{console.log(error)});
  }

  componentDidMount = ()=>{
    //console.log("IN CDM method")
    this.loadData()
  };

  showData = (item)=>{
    //console.log(item)
    const photo = item.item;
    //console.log("IN showdata")
    return (
      <Image source={{uri:`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}}
        style={{height:200, width:'48%',margin:'1%'}}/>
    );
  };

  loadMorePics = ({distanceFromEnd})=>{
    if(!this.onEndReachedCalledDuringMomentum){
    console.log("In load more pics(Footer reached)")
    this.state.page <= 2 ?
    this.loadNextPage()
    : ToastAndroid.show("Sorry, reached limit!", ToastAndroid.SHORT);
    this.onEndReachedCalledDuringMomentum = true;
    }
  };

  loadNextPage = ()=>{
    this.setState({isLoadingMore: true})
    console.log("Page num earlier : "+this.state.page);
    this.setState({page:(this.state.page)+1}, this.loadData);
    console.log("Page incremented to "+this.state.page);
  }

  renderLoading = ()=>{
    console.log("In render loading")
    //console.log("loading more ? "+this.state.isLoadingMore);
    return this.state.isLoadingMore ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={'gray'}/> 
      </View>
    ) : null;
  };

  render()
  {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor={'#ff9900'}/>
      { this.state.searchOn ?
      <View style={styles.header}>
       <Pressable onPress={()=>{this.setState({searchOn:false})}}>
        <AntDesign name="left" size={22} color={"white"}/>
      </Pressable>
       <SearchBar 
          onCancel={()=>{this.setState({searchOn:false})}}
          onChangeText={(text)=>{this.setState({searchQuery:text})}}
          inputContainerStyle={styles.searchBar}
          containerStyle={styles.searchBarContainer}
          value={this.state.searchQuery}
          placeholder="Search flickr"
          />
       <TouchableOpacity style={{
          backgroundColor:'lightgray',padding: 8}}>
          <Text>Go</Text>
        </TouchableOpacity>
      </View>
        :
      <View style={styles.header}>
        <Text style={styles.title}>Flickr photos</Text>
        <Pressable android_ripple={button_ripple} onPress={()=>{this.setState({searchOn:true})}}>
          <FontAwesome name="search" size={26} color={'white'}/>
        </Pressable>
      </View>
      }
      <View style={styles.body}>
        {
          !this.state.isLoadingMain ? 
        <FlatList data={this.state.picData} keyExtractor={(item, index)=>{return index}} 
            renderItem={this.showData} 
            numColumns={2}
            onEndReached={this.loadMorePics.bind(this)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this.renderLoading}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            />
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
  footerLoader: {
    width:'100%',
    height:60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  searchBarContainer: {
    width:'80%',
    backgroundColor: 'orange',
    borderWidth: 0,
    borderTopWidth:0,
    borderBottomWidth:0,
  }
});
