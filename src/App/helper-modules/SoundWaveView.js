import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo
} from "react";
import styled from "styled-components";
import { WaveSurfer, WaveForm, Region, Marker } from "wavesurfer-react";
import "../style_sheets/SoundWaveView.css";
// import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import MarkersPlugin from "wavesurfer.js/src/plugin/markers";
import soundRef from "../res/song.mp3"
const Timeline = styled.div`
    border: 2px black solid;
`

const Buttons = styled.div`
    display: inline-block;
  `;

const Button = styled.button``;

/**
 * @param min
 * @param max
 * @returns {*}
 */
function generateNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}

/**
 * @param distance
 * @param min
 * @param max
 * @returns {([*, *]|[*, *])|*[]}
 */
function generateTwoNumsWithDistance(distance, min, max) {
    const num1 = generateNum(min, max);
    const num2 = generateNum(min, max);
    // if num2 - num1 < 10
    if (num2 - num1 >= 10) {
        return [num1, num2];
    }
    return generateTwoNumsWithDistance(distance, min, max);
}

function SoundWaveView(props) {
    const { setSoundDuration } = props
    const { markers, setMarkers } = props
    const { soundSourceRef } = props

    const [timelineVis, setTimelineVis] = useState(true);



    const plugins = useMemo(() => {
        return [
            //     { regions commented out as it was cluttering the view
            //         plugin: RegionsPlugin,
            //         options: { dragSelection: true }
            //     },
            timelineVis && {
                plugin: TimelinePlugin,
                options: {
                    container: "#timeline"
                }
            },
            {
                plugin: MarkersPlugin,
                options: {
                    markers: [{ draggable: true }]
                }
            }
        ].filter(Boolean);
    }, [timelineVis]);

    const toggleTimeline = useCallback(() => {
        setTimelineVis(!timelineVis);
    }, [timelineVis]);

    const [regions, setRegions] = useState([
        {
            id: "region-1",
            start: 0.5,
            end: 10,
            color: "rgba(0, 0, 0, .5)",
            data: {
                systemRegionId: 31
            }
        },
        {
            id: "region-2",
            start: 5,
            end: 25,
            color: "rgba(225, 195, 100, .5)",
            data: {
                systemRegionId: 32
            }
        },
        {
            id: "region-3",
            start: 15,
            end: 35,
            color: "rgba(25, 95, 195, .5)",
            data: {
                systemRegionId: 33
            }
        }
    ]);

    const renderCountRef = useRef(0);

    useEffect(() => {
        renderCountRef.current = renderCountRef.current + 1
    }, [renderCountRef])


    // use regions ref to pass it inside useCallback
    // so it will use always the most fresh version of regions list
    const regionsRef = useRef(regions);

    useEffect(() => {
        regionsRef.current = regions;
    }, [regions]);

    const regionCreatedHandler = useCallback(
        (region) => {
            console.log("region-created --> region:", region);

            if (region.data.systemRegionId) return;

            setRegions([
                ...regionsRef.current,
                { ...region, data: { ...region.data, systemRegionId: -1 } }
            ]);
        },
        [regionsRef]
    );

    const wavesurferRef = useRef();

    /**
     * Initialize wavesurferRef and subscribe to event listeners
     */
    const handleWSMount = useCallback(
        // An instance of wavesurfer is passed by the Wavesurfer react component
        (waveSurfer) => {
            if (waveSurfer.markers) {
                waveSurfer.clearMarkers();
            }

            // Initialize wavesurferRef
            wavesurferRef.current = waveSurfer;

            // Subscribe event listeners
            if (wavesurferRef.current) {

                wavesurferRef.current.load(soundSourceRef.current);
                // wavesurferRef.current.load(soundRef);
                

                wavesurferRef.current.on("region-created", regionCreatedHandler);

                wavesurferRef.current.on("ready", () => {
                    console.log("WaveSurfer is ready");
                    setSoundDuration(wavesurferRef.current.getDuration())
                });

                wavesurferRef.current.on("region-removed", (region) => {
                    console.log("region-removed --> ", region);
                });

                wavesurferRef.current.on("loading", (data) => {
                    console.log("loading --> ", data);
                });

                wavesurferRef.current.on("marker-click", (...args) => {
                    console.log("marker-click", ...args);
                });


                if (window) {
                    window.surferidze = wavesurferRef.current;
                }
            }
        },
        [regionCreatedHandler, setSoundDuration]
    );

    const generateRegion = useCallback(() => {
        if (!wavesurferRef.current) return;
        const minTimestampInSeconds = 0;
        const maxTimestampInSeconds = wavesurferRef.current.getDuration();
        const distance = generateNum(0, 10);
        const [min, max] = generateTwoNumsWithDistance(
            distance,
            minTimestampInSeconds,
            maxTimestampInSeconds
        );

        const r = generateNum(0, 255);
        const g = generateNum(0, 255);
        const b = generateNum(0, 255);

        setRegions([
            ...regions,
            {
                id: `custom-${generateNum(0, 9999)}`,
                start: min,
                end: max,
                color: `rgba(${r}, ${g}, ${b}, 0.5)`
            }
        ]);
    }, [regions, wavesurferRef]);



    const generateMarker = useCallback(() => {
        if (!wavesurferRef.current) return;
        const minTimestampInSeconds = 0;
        const maxTimestampInSeconds = wavesurferRef.current.getDuration();
        const distance = generateNum(0, 10);
        const [min] = generateTwoNumsWithDistance(
            distance,
            minTimestampInSeconds,
            maxTimestampInSeconds
        );

        const r = generateNum(0, 255);
        const g = generateNum(0, 255);
        const b = generateNum(0, 255);

        setMarkers([
            ...markers,
            {
                label: `custom-${generateNum(0, 9999)}`,
                time: min,
                color: `rgba(${r}, ${g}, ${b}, 0.5)`
            }
        ]);
    }, [markers, setMarkers, wavesurferRef]);

    const removeLastRegion = useCallback(() => {
        let nextRegions = [...regions];

        nextRegions.pop();

        setRegions(nextRegions);
    }, [regions]);
    const removeLastMarker = useCallback(() => {
        let nextMarkers = [...markers];

        nextMarkers.pop();

        setMarkers(nextMarkers);
    }, [markers, setMarkers]);

    const shuffleLastMarker = useCallback(() => {
        setMarkers((prev) => {
            const next = [...prev];
            let lastIndex = next.length - 1;

            const minTimestampInSeconds = 0;
            const maxTimestampInSeconds = wavesurferRef.current.getDuration();
            const distance = generateNum(0, 10);
            const [min] = generateTwoNumsWithDistance(
                distance,
                minTimestampInSeconds,
                maxTimestampInSeconds
            );

            next[lastIndex] = {
                ...next[lastIndex],
                time: min
            };

            return next;
        });
    }, [setMarkers]);

    const play = useCallback(() => {
        wavesurferRef.current.playPause();
    }, []);
    
    const playFromMarker = useCallback(() => {
        console.log(markers)
        const start = markers[markers.length - 1].time
        wavesurferRef.current.play(start);
    }, [markers]);

    const handleTimelineClick = useCallback((e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const relativePosition = x / rect.width
        const duration = wavesurferRef.current.getDuration()
        const position = duration * relativePosition;
        const r = generateNum(0, 255);
        const g = generateNum(0, 255);
        const b = generateNum(0, 255);

        setMarkers((current)=>{
            return [
            ...current,
            {
                label: `timestamp-${markers.length + 1}`,
                time: position,
                color: `rgba(${r}, ${g}, ${b}, 0.5)`,
                draggable: true
            }
        ]})
    });

    const handleRegionUpdate = useCallback((region, smth) => {
        console.log("region-update-end --> region:", region);
        console.log(smth);
    }, []);

    return (
        <div className="SoundWaveView">
            <h1>Render Count: {renderCountRef.current}</h1>
            <WaveSurfer plugins={plugins} onMount={handleWSMount} >
                <WaveForm id="waveform" cursorColor="transparent" >
                    {/* {regions.map((regionProps) => ( Regions are disabled as they were cluttering the view
                        <Region
                            onUpdateEnd={handleRegionUpdate}
                            key={regionProps.id}
                            {...regionProps}
                        />
                    ))} */}
                    {markers.map((marker, index) => (
                        <Marker
                            className="Marker"
                            key={index}
                            {...marker}
                            onClick={(...args) => {
                                console.log("onClick", ...args);
                            }}
                            onDrag={(...args) => {
                                console.log("onDrag", ...args);
                            }}
                            onDrop={(newMarker, event) => {
                                console.log("onDrop", newMarker, event);
                                const index = markers.findIndex(marker => marker.label === newMarker.label);
                                let nextMarkers = [...markers]
                                nextMarkers[index].time = newMarker.time
                                setMarkers(nextMarkers)
                            }}
                        />
                    ))}
                </WaveForm>
                <Timeline id="timeline" onClick={handleTimelineClick} />
            </WaveSurfer>
            <Buttons>
                {/* <Button onClick={generateRegion}>Generate region</Button> */}
                {/* <Button onClick={generateMarker}>Generte Marker</Button> */}
                <Button onClick={play}>Play / Pause</Button>
                <Button onClick={playFromMarker}>Play last marker</Button>
                {/* <Button onClick={removeLastRegion}>Remove last region</Button> */}
                <Button onClick={removeLastMarker}>Remove last marker</Button>
                {/* <Button onClick={shuffleLastMarker}>Shuffle last marker</Button> */}
                {/* <Button onClick={toggleTimeline}>Toggle timeline</Button> */}
                {/* <Button onClick={() => console.log(markers)}>TEST</Button> */}

            </Buttons>
        </div>
    );
}

export default SoundWaveView;

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
