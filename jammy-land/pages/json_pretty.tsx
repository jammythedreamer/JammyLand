import React, {useState} from 'react'
import type { NextPage } from 'next'
import styles from '../styles/JsonPretty.module.css'
import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";
import { Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';

const Home: NextPage = () => {
  const [inputText, setInputText]  = useState('');
  const [outputText, setOutputText] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);
  const [spaceAmount, setSpaceAmount] = useState(2);

  function prettyPrint(str: string){
    return JSON.stringify(JSON.parse(str), null, spaceAmount);
  };

  function validateJSON(str: string){
    console.log(str);
    try {
      if (str == "") {
        setIsValidInput(true);
        return;
      }
      const obj = JSON.parse(str);
      setIsValidInput(true);
    } catch (err) {
      setIsValidInput(false);
    }
  }

  return (
    <Box className={styles.container} style={{flexDirection: 'row', flex: 1}}>
      <Box className={styles.input}>
        {isValidInput? null : <Typography>Invalid Input</Typography>}
        <Typography className={styles.title}>Input</Typography>
        <TextField
          value={inputText}
          fullWidth
          multiline
          rows={30}
          onChange={(evt)=> {setInputText(evt.target.value);validateJSON(evt.target.value)}}
        />
      </Box>
      <Box className={styles.function}>
        <Select
          className={styles.spaceAmountSelect}
          labelId="space-amount-select-label"
          id="space-amount-select"
          value={spaceAmount}
          label="space amount"
          onChange={(evt) => setSpaceAmount(evt.target.value as number)}
        >
          <MenuItem value={0}>compact</MenuItem>
          <MenuItem value={2}>2 Tap Space</MenuItem>
          <MenuItem value={3}>3 Tap Space</MenuItem>
          <MenuItem value={4}>4 Tap Space</MenuItem>
        </Select>
        <Button 
          className={styles.convertButton}
          variant='contained'
          onClick={()=>setOutputText(prettyPrint(inputText))}
        >
          convert
        </Button>
      </Box>
      <Box className={styles.output}>
        <Typography className={styles.title}>Output</Typography>
        <div className={styles.outputCodeBlock}>
        <CopyBlock
          text={outputText}
          language={"json"}
          showLineNumbers
          startingLineNumber={1}
          theme={dracula}
          codeBlock
          // fullWidth
          // multiline
          // rows={30}
          // onChange={(evt)=>setOutputText(evt.target.value)}
        />
        </div>
      </Box>
    </Box>
  )
}

export default Home
