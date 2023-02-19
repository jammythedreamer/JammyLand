import React, {useState} from 'react'
import type { NextPage } from 'next'
import styles from '../styles/PromptGenerator.module.css'
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Popover,
} from '@mui/material';
import { RemoveCircle, Palette, ArrowCircleLeft, ArrowCircleRight } from '@mui/icons-material';
import colorJson from '../data/color.json';
import tagJson from '../data/tag.json';

const colorData: IColor = colorJson;
const tagData: { [key: string]: string[]} = tagJson;

interface ITag {
  name: string;
  weight: number;
  color: string;
}

interface IColor {
  [name: string]: {
    ko: string;
    color_code: string | null;
  };
}

function tagGenerator(name: string) {
  const tag: ITag = {
    name,
    weight: 0,
    color: "none",
  }
  return tag;
}

const Home: NextPage = () => {
  const [tagList, setTagList] = useState<ITag[]>(Object.values(tagData).flat().map(tagGenerator));
  const [promptString, setPromptString] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [negativePromptString, setNegativePromptString] = useState('');
  const [openPalettePopover, setOpenPalettePopover] = useState(false);
  const [targetTag, setTargetTag] = useState<ITag | null>(null);
  const [searchText, setSearchText] = useState('');
  
  const activateTag = (tag: ITag) => {
    const newTag: ITag = {
      ...tag,
      weight: 10,
    }
    const foundIndex = tagList.findIndex(elem => elem.name === tag.name);
    const newTagList = [...tagList];
    newTagList[foundIndex] = newTag;
    setTagList(newTagList);
    tagListToPrompt(newTagList);
  }

  const deactivateTag = (tag: ITag) => {
    const newTag: ITag = {
      ...tag,
      weight: 0,
    }
    const foundIndex = tagList.findIndex(elem => elem.name === tag.name);
    const newTagList = [...tagList];
    newTagList[foundIndex] = newTag;
    setTagList(newTagList);
    tagListToPrompt(newTagList);
  }

  const handleChangeColor = (color: string) => {
    if(!targetTag) {
      return;
    }
    const newTag: ITag = {
      ...targetTag,
      color: color,
    }
    const foundIndex = tagList.findIndex(elem => elem.name === targetTag.name);
    const newTagList = [...tagList];
    newTagList[foundIndex] = newTag;
    setTagList(newTagList);
    tagListToPrompt(newTagList);
  }

  const handleChangeWeight = (tag: ITag, delta: number) => {
    const newTag: ITag = {
      ...tag,
      weight: Math.min(Math.max(tag.weight + delta, 5), 15),
    }
    const foundIndex = tagList.findIndex(elem => elem.name === tag.name);
    const newTagList = [...tagList];
    newTagList[foundIndex] = newTag;
    setTagList(newTagList);
    tagListToPrompt(newTagList);
  }

  const tagListToPrompt = (tagList: ITag[]) => {
    const prompt = tagList.filter(tag => tag.weight !== 0).map(convertTag).join(', ');
    setPromptString(prompt);
  }

  const convertTag = (tag: ITag) => {
    let str = tag.name;
    if (tag.color && tag.color !== "none") {
      str = `${tag.color} ${str}`;
    }
    if (tag.weight !== 10) {
      str = `(${str}:${(tag.weight / 10).toFixed(1)})`;
    }
    return str;
  }

  const openPalette = (el: HTMLElement | null, tag: ITag) => {
    setAnchorEl(el);
    setOpenPalettePopover(true);
    setTargetTag(tag);
  }

  const renderTagSelector = (tag: ITag | null) => {
    if(!tag) {
      return;
    }
    if(searchText !== '' && tag.name.search(searchText) === -1){
      return;
    }
    if(tag.weight === 0) {
      return <Chip key={tag.name} label={tag.name} onClick={() => activateTag(tag)} variant="outlined" />
    }
    return <>
      <Chip key={tag.name} label={tag.name} onClick={() => activateTag(tag)} variant="outlined" />
      <ArrowCircleLeft sx={{ color: tag.weight > 5 ? "blue" : "disabled", cursor: "pointer", verticalAlign: "middle" }} onClick={() => handleChangeWeight(tag, -1)} />
      <input style={{width: "2rem"}} value={(tag.weight / 10).toFixed(1)} min={5} max={15}/>
      <ArrowCircleRight sx={{ color: tag.weight < 15 ? "blue" : "disabled", cursor: "pointer", verticalAlign: "middle" }} onClick={() => handleChangeWeight(tag, 1)} />
      <Palette
        id={`${tag.name}:palette`}
        sx={{ color: colorData[tag.color].color_code, cursor: "pointer", verticalAlign: "middle" }}
        onClick={() => openPalette(document.getElementById(`${tag.name}:palette`), tag)}
      />
      <RemoveCircle onClick={() => deactivateTag(tag)} sx={{ color: "red", cursor: "pointer", verticalAlign: "middle" }}/>
    </>
  }

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
  }

  return (
    <Box className={styles.container} >
      <Box className={styles.box1}>
        <TextField
          label="Search" variant="filled"
          sx={{backgroundColor: "white"}}
          value={searchText}
          onChange={(evt) => setSearchText(evt.target.value)}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "red", height: "55px" }}
          onClick={() => setSearchText("")}
        >
          X
        </Button>
        {Object.entries(tagData).map(([key, value], idx) => 
          <Accordion key={idx} expanded>
            <AccordionSummary>
              {key}
            </AccordionSummary>
            <AccordionDetails>
              {value.map((tag) => {
                return renderTagSelector(tagList.find(elem => elem.name === tag) ?? null);
              })}
            </AccordionDetails>
          </Accordion>  
        )}
      </Box>
      <Box className={styles.box2}>
        <div>
          <label>Prompt</label>
          <textarea
            className={styles.prompt_textarea}
            value={promptString}
            onChange={(evt) => setPromptString(evt.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => handleCopy(promptString)}
          >
            Copy
          </Button>
        </div>
        <div>
          <label>Negative Prompt</label>
          <textarea
            className={styles.prompt_textarea}
            value={negativePromptString}
            onChange={(evt) => setNegativePromptString(evt.target.value)}
            
          />
          <Button
            variant="contained"
            onClick={() => handleCopy(negativePromptString)}
          >
            Copy
          </Button>
        </div>
      </Box>
      <Popover
        open={openPalettePopover}
        anchorEl={anchorEl}
        onClose={() => setOpenPalettePopover(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2,  backgroundColor: "#DDDEEE" }}>
          <div>
          {Object.entries(colorData).filter(([key, value]) => value.color_code !== null).map(([key, value]) => {
            return <Chip
              key={key}
              label={value.ko}
              sx={{ backgroundColor: value.color_code, color: "#333333", marginRight: "5px", cursor: "pointer" }}
              onClick={() => handleChangeColor(key)}
            />
          })}
          </div>
          <div>
          {Object.entries(colorData).filter(([key, value]) => value.color_code === null).map(([key, value]) => {
            return <Chip
              key={key}
              label={value.ko}
              sx={{ backgroundColor: value.color_code, color: "black", marginRight: "5px", cursor: "pointer" }}
              onClick={() => handleChangeColor(key)}
            />
          })}
          </div>
        </Box>
      </Popover>
    </Box>
  )
}

export default Home
