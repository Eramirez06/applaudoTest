import React, { Component } from 'react';
import { View, Image, Text, FlatList, Keyboard } from 'react-native';
import styles from './styles';

//Methods
import {
  requestGenres,
  requestDataByType,
  filterByType,
  requestMoreData,
} from '../../../api/home';

//Custom
import ContentScreen from '../../../components/content';
import Header from '../../../components/header';
import Tabs from '../../../components/tabs';
import EmptyState, { Loading } from '../../../components/common/loading';
import Categories, { Cards } from '../../../components/categories';

var search;

class Home extends Component {
  state = {
    isAnime: true,
    listSourceAnime: [],
    listSourceManga: [],
    filterAnime: [],
    filterManga: [],
    copyAnime: [],
    copyManga: [],
    isLoading: true,
    refreshing: false,
    isSearching: false,
    filterBy: '',
  };

  componentDidMount = () => {
    this.requestData();
  };

  componentDidUpdate = (_, prevState) => {
    let { filterBy } = this.state;
    if (
      filterBy !== prevState.filterBy &&
      prevState.filterBy.length === 0 &&
      filterBy.length !== 0
    ) {
      this.setState({ isSearching: true });
    }
  };

  requestData = async (isRefres = false) => {
    let { isAnime } = this.state;
    isRefres
      ? this.setState({
          refreshing: true,
        })
      : this.setState({
          isLoading: true,
        });

    //Get all Genger
    const response = await requestGenres();

    //By api structure we need to request per record and get animes/mangas by genres separatly
    let listSource = [];
    for (const iterator of response.data.data) {
      let responseType = await requestDataByType(
        iterator.attributes.name,
        isAnime ? 'anime' : 'manga',
      );

      //Contruct data for display UI
      let construct = {
        data: responseType.data.data,
        title: iterator.attributes.name,
      };
      listSource.push(construct);
    }

    //Need to much code to prevent user use to much data downloading infor several times
    isRefres
      ? this.setState(
          isAnime
            ? {
                refreshing: false,
                listSourceAnime: listSource,
                copyAnime: listSource,
              }
            : {
                refreshing: false,
                listSourceManga: listSource,
                copyManga: listSource,
              },
        )
      : this.setState(
          isAnime
            ? {
                isLoading: false,
                listSourceAnime: listSource,
                copyAnime: listSource,
              }
            : {
                isLoading: false,
                listSourceManga: listSource,
                copyManga: listSource,
              },
        );
  };

  onTabChange = (isAnime) => {
    let {
      listSourceManga,
      copyManga,
      copyAnime,
      isSearching,
      filterBy,
    } = this.state;

    //this is for animation performance when app display to much data
    //Need to much code to prevent user use to much data downloading infor several times
    if (!isSearching) {
      if (listSourceManga.length === 0) {
        this.setState({ isAnime, isLoading: true }, () => {
          this.requestData();
        });
      } else {
        this.setState({ isLoading: true });
        !isAnime
          ? this.setState({ listSourceAnime: [] })
          : this.setState({ listSourceManga: [] });
        setTimeout(() => {
          this.setState({ isLoading: false, isAnime });
          !isAnime
            ? this.setState({ listSourceAnime: copyAnime })
            : this.setState({ listSourceManga: copyManga });
        }, 600);
      }
    } else {
      let type = isAnime ? 'anime' : 'manga';
      this.filterData(type, filterBy);
    }
  };

  goTo = (screen, props) => {
    let { isAnime } = this.state;
    let { navigation } = this.props;
    navigation.navigate(screen, { data: props, isAnime });
  };

  changeText = async (filterBy) => {
    let { isAnime } = this.state;
    this.setState({ filterBy });
    clearTimeout(search);
    let type = isAnime ? 'anime' : 'manga';
    search = setTimeout(async () => {
      this.filterData(type, filterBy);
    }, 1000);
  };

  filterData = async (type, value = false) => {
    let { isAnime, filterBy } = this.state;
    let filter = value ? value : filterBy;
    let response = await filterByType(type, filter);
    isAnime
      ? this.setState({ filterAnime: response.data })
      : this.setState({ filterManga: response.data });
  };

  SearchFinish = () => {
    Keyboard.dismiss();
    this.setState({
      isSearching: false,
      filterBy: '',
      filterAnime: [],
      filterManga: [],
    });
  };

  getMoreData = async () => {
    let { isAnime, filterAnime, filterManga } = this.state;
    let copyAnime = { ...filterAnime };
    let copyManga = { ...filterManga };
    if (filterAnime.links.next) {
      let linkNext = isAnime ? filterAnime.links.next : filterManga.links.next;
      let response = await requestMoreData(linkNext);
      if (isAnime) {
        let newArray = {
          data: copyAnime.data.concat(response.data.data),
          links: {
            next: response.data.links.next,
          },
        };
        this.setState({ filterAnime: newArray });
      } else {
        let newArray = {
          data: copyManga.data.concat(response.data.data),
          links: {
            next: response.data.links.next,
          },
        };
        this.setState({ filterManga: newArray });
      }
    }
  };

  render() {
    let {
      isLoading,
      listSourceAnime,
      listSourceManga,
      refreshing,
      isAnime,
      isSearching,
      filterBy,
      filterAnime,
      filterManga,
    } = this.state;

    return (
      <ContentScreen>
        <Header
          filterBy={filterBy}
          onRequestClose={this.SearchFinish}
          onChangeText={this.changeText}
          isSearching={isSearching}
        />
        <Tabs onPress={this.onTabChange} />
        {!isSearching ? (
          <FlatList
            key="value1"
            style={styles.content}
            data={isAnime ? listSourceAnime : listSourceManga}
            keyExtractor={(item) => item.title}
            renderItem={({ item, index }) => (
              <Categories indexSup={index} onPress={this.goTo} {...item} />
            )}
            ListEmptyComponent={
              isLoading ? (
                <Loading />
              ) : (
                <EmptyState text={'We do not have data to display'} />
              )
            }
            refreshing={refreshing}
            onRefresh={() => this.requestData(true)}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            key="value2"
            numColumns={3}
            style={styles.content}
            contentContainerStyle={styles.rowK}
            data={isAnime ? filterAnime.data : filterManga.data}
            keyExtractor={(item) => item.title}
            renderItem={({ item, index }) => (
              <Cards small indexSup={index} onPress={this.goTo} {...item} />
            )}
            ListEmptyComponent={
              isLoading ? (
                <Loading />
              ) : (
                <EmptyState text={'We do not have data to display'} />
              )
            }
            onEndReachedThreshold={0.5}
            onEndReached={this.getMoreData}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ContentScreen>
    );
  }
}
export default Home;
