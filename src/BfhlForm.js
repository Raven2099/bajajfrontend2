import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const BfhlForm = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateJson(jsonInput)) {
      setError('Invalid JSON format.');
      return;
    }

    try {
      const backendUrl = 'https://bajaj-backend-ivory.vercel.appbfhl';
// Replace with your backend URL

      const res = await axios.post(backendUrl, JSON.parse(jsonInput));
      setResponse(res.data);
    } catch (error) {
      setError('There was an error processing your request.');
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = selectedOptions.reduce((acc, option) => {
      acc[option.value] = response[option.value];
      return acc;
    }, {});

    return (
      <div>
        <h2>Response:</h2>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div>
      <h1>BFHL Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>JSON Input:</label>
          <textarea
            value={jsonInput}
            onChange={handleJsonChange}
            rows="5"
            cols="50"
            placeholder='{ "data": ["A","C","z"] }'
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Submit</button>
      </form>

      {response && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            placeholder="Select options"
          />
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default BfhlForm;
