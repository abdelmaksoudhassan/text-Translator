import React, { useEffect, useRef, useState } from "react";
import countries from "./data.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faCopy, faExchange } from '@fortawesome/free-solid-svg-icons'
 
const Translate = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [text,setText] = useState('')
    const [fromLang,setFromLang] = useState("en-GB")
    const [toLang,setToLang] = useState("ar-SA")
    const translated = useRef()

    useEffect(()=>{
        if(text === ''){
            translated.current.value = ''
        }
    },[text])

    async function handleTranslate(){
        if(text.length === 0){
            return
        }
        translated.current.value = ''
        translated.current.placeholder = 'Translating ...'
        try {
                const response = await
                    fetch(`${apiUrl}/?text=${text}&source=${fromLang}&target=${toLang}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const translatedText = await response.text();
                translated.current.value = translatedText;
            } catch (error) {
                console.error("Fetch error:", error);
                translated.current.placeholder = "Error in translation";
            }
    }

    function textToSpeech(txt,lang){
        const utterance = new SpeechSynthesisUtterance(txt);
        utterance.lang = lang;
        speechSynthesis.speak(utterance);
    }

    function handleFromCopy(){
        navigator.clipboard.writeText(text)
    }

    function handleFromSpeech(){
        textToSpeech(text,fromLang)
    }

    function handleToCopy(){
        navigator.clipboard.writeText(translated.current.value)
    }
    
    function handleToSpeech(){
        textToSpeech(translated.current.value,toLang)
    }

    function handleExchange(){
            const from_text = text;
            const from_lang = fromLang;
            setText(translated.current.value);
            setFromLang(toLang);
            translated.current.value = from_text;
            setToLang(from_lang);
    }

    return (
        <>
            <div className="above-container">
                <img
                    src={"translate.png"}
                    className="above-container-content"
                    alt="Logo"
                />
                <h1 className="above-container-content">Translate</h1>
            </div>
 
            <div className="container">
                <div className="above-container" style={{margin: '10px 0px'}}>
                    <FontAwesomeIcon icon={faExchange} size={'lg'} className="icon" onClick={handleExchange} />
                </div>
                <div className="wrapper">
                    <div className="side">
                        <textarea
                            spellCheck="false"
                            placeholder="Enter text"
                            value={text}
                            onChange={(e)=>setText(e.target.value)}
                        ></textarea>
                        <div className="controls">
                            <div className="icons">
                                <FontAwesomeIcon icon={faVolumeUp} className="icon" onClick={handleFromSpeech} />
                                <FontAwesomeIcon icon={faCopy} className="icon" onClick={handleFromCopy} />
                            </div>
                            <select value={fromLang} onChange={(e)=>{setFromLang(e.target.value)}}>
                                { Object.keys(countries).map((keyName, i) => (
                                    <option key={i} value={keyName}>
                                        {countries[keyName]}
                                    </option>
                                )) }
                            </select>
                        </div>
                    </div>
                    <div className="side">
                        <textarea
                            spellCheck="false"
                            readOnly
                            disabled
                            placeholder="Translation"
                            ref={translated}
                        ></textarea>
                        <div className="controls">
                            <select value={toLang} onChange={(e)=>{setToLang(e.target.value)}}>
                                { Object.keys(countries).map((keyName, i) => (
                                    <option key={i} value={keyName}>
                                        {countries[keyName]}
                                    </option>
                                )) }
                            </select>
                            <div className="icons">
                                <FontAwesomeIcon icon={faVolumeUp} className="icon" onClick={handleToSpeech} />
                                <FontAwesomeIcon icon={faCopy} className="icon" onClick={handleToCopy} />
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={handleTranslate}>Translate Text</button>
            </div>
        </>
    );
};
 
export default Translate;