import styled from 'styled-components';

export const Container = styled.div`
  margin: 30px auto;
  max-width: 320px;
  width: 80%;
`;

export const LanguageSelectorContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;

  label {
    margin-right: 10px;
    font-weight: bold;
  }

  select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #000;
    font-size: 16px;
  }
`;
