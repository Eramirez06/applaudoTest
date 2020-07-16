import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import styles from './styles';

//Icons
import SearchIcon from '../icons/searchIcon';
import CloseIcon from '../icons/closeIcon';
import { whiteColor } from '../../assets/colors';

const Header = ({ isSearching, onChangeText, onRequestClose, filterBy }) => {
  return (
    <View style={styles.container}>
      <SearchIcon />
      <TextInput
        value={filterBy}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={whiteColor}
      />
      {isSearching ? (
        <TouchableOpacity onPress={onRequestClose} style={styles.clear}>
          <CloseIcon />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default Header;
