import { useCallback, useMemo, useState } from "react";
import SoundWaveView from "./helper-modules/SoundWaveView";
import TextAreaWithLineNumber from 'text-area-with-line-number';
import { duration } from "@mui/material";

export default function SoundSyncActivity(props) {
    const {setSyncedLyrics} = props
    const [markers, setMarkers] = useState([]);
    const [text, setText] = useState("");
    const [soundDuration, setSoundDuration] = useState(0)
    

    const handleTextUpdate = useCallback((event) => {
        setText(event.target.value)
    }, [setText])

    const handleSubmit = useCallback((event) => {
        const lines = text.split("\n")
        const numberOfSections = Math.max(lines.length, markers.length + 1)
        const sections = []
        const duration = soundDuration

        sections[0] = { startTime: 0, text: lines[0] }

        for (let i = 1; i < numberOfSections; i++) {
            const marker = markers.find(marker => marker.label === "timestamp-" + i)
            const startTime = marker?.time
            const text = lines[i]

            sections[i] = {
                startTime: startTime ? startTime : 0,
                text: text ? text : "..."
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

        console.log(duration)
        console.log("sections: ", sections)
    }, [text, markers, soundDuration])

    return (
        <div className="SoundSyncActivity">
            <SoundWaveView
                markers={markers}
                setMarkers={useCallback(nextMarkers => setMarkers(nextMarkers), [setMarkers])}
                setSoundDuration={useCallback(duration => setSoundDuration(duration), [setSoundDuration])}
            />
            <TextAreaWithLineNumber onChange={handleTextUpdate} />
            <button onClick={handleSubmit}>Submit</button>
        </div>

    )
}