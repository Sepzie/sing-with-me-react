import { useCallback, useMemo, useState, useRef } from "react";
import SoundWaveView from "./helper-modules/SoundWaveView";
import TextAreaWithLineNumber from './helper-modules/TAWLN/index';
import { duration } from "@mui/material";

export default function SoundSyncActivity(props) {
    const { setSyncedLyrics } = props
    const { soundSourceRef } = props
    const [markers, setMarkers] = useState([]);
    const [text, setText] = useState("");
    const [soundDuration, setSoundDuration] = useState(0)
    const soundWaveView = useRef(null)
    const [, updateState] = useState()


    const handleTextUpdate = useCallback((event) => {
        setText(event.target.value)
    }, [setText])

    const handleSubmit = useCallback((event) => {
        const lines = text.split("\n")
        const numberOfSections = Math.max(lines.length, markers.length + 1)
        const sections = []

        sections[0] = {
            startTime: 0,
            text: lines[0] || "..."
        }

        for (let i = 1; i < numberOfSections; i++) {
            const marker = markers.find(marker => marker.label === "timestamp-" + i)
            const startTime = marker?.time
            const text = lines[i]

            sections[i] = {
                startTime: startTime ? startTime : 0,
                text: text || "..."
            }
        }


        for (let i = 0; i < sections.length; i++) {
            const startTime = sections[i].startTime
            let endTime

            if (i < markers.length) {
                endTime = sections[i + 1].startTime
            } else if (i === markers.length) {
                endTime = soundDuration
            } else {
                endTime = 0
            }
            let duration = endTime - startTime
            // duration = duration > 0? duration : 0
            sections[i].duration = duration
        }

        // convert to miliseconds
        sections.forEach(section=>{
            section.startTime = Math.round(section.startTime * 1000) 
            section.duration = Math.round(section.duration * 1000)
        })

        setSyncedLyrics(sections)
    }, [text, markers, soundDuration, setSyncedLyrics])

    const SwvComponent = (
        <SoundWaveView
            markers={markers}
            setMarkers={useCallback(nextMarkers => setMarkers(nextMarkers), [setMarkers])}
            setSoundDuration={useCallback(duration => setSoundDuration(duration), [setSoundDuration])}
            soundSourceRef={soundSourceRef}
        />
    )

    const LoadSoundWaveView = () => {
        updateState(s=>s+1)
    }

    return (
        <div className="SoundSyncActivity">
            <button onClick={LoadSoundWaveView}>Load Sound Editor</button>
            <span
                title="Upload an audio file, load the sound editor, click the band to add segments, then match each lyric line below. Submit to generate practice buttons."
                style={{ marginLeft: "12px", cursor: "help" }}
            >
                ❓
            </span>
            {soundSourceRef.current && SwvComponent}
            {soundSourceRef.current ? (
                <p>Click the band above to add a segment. Each segment lines up with the corresponding lyric line below.</p>
            ) : (
                <p>Please choose an audio file and press Load Sound Editor.</p>
            )}
            {/* <LoadSoundWaveView /> */}
            {/* <SoundWaveView
            markers={markers}
            setMarkers={useCallback(nextMarkers => setMarkers(nextMarkers), [setMarkers])}
            setSoundDuration={useCallback(duration => setSoundDuration(duration), [setSoundDuration])}
            soundSourceRef={soundSourceRef}
        /> */}
            <TextAreaWithLineNumber onChange={handleTextUpdate} />
            <button onClick={handleSubmit}>Submit</button>
        </div>

    )
}
