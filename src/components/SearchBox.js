import React, { useState } from 'react';
import { Box, TextInput, Button } from 'grommet';
import { useHistory } from 'react-router-dom';
import { Search } from 'grommet-icons';

const SearchBox = () => {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const performSearch = () => {
    if (search.length === 95) {
      history.push(`/user/${search}`);
    } else if (!isNaN(search)) {
      history.push(`/height/${search}`);
    } else { history.push(`/sn/${search}`); }
  };

  return (
    <>
      <TextInput
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        onKeyPress={(event) => { if (event.key === 'Enter') { performSearch(); } }}
        plain={false}
        type="text"
        placeholder="SN key, Wallet address, Height"
      />
      <Button margin="small" label="Find" onClick={() => { performSearch(); }} />
    </>
  );
};


export default SearchBox;
