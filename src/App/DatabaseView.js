import React from 'react';
import { db } from './firebaseAPI'
import { collection, getDocs } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { getDatabase, set } from "firebase/database";
import { ref } from 'firebase/storage';
import FormDialog from './helper-modules/FormDialog';
// const db = getDatabase();





class DatabaseView extends React.Component {
    constructor(props) {
        super(props)
        this.state = { documents: [] }
    }

    writeSong = async (title, artist) => {
        const songId = title.toLowerCase().replace(/ /g, "-");
        await setDoc(doc(db, this.props.collection, songId), {
            title: title,
            artist: artist,
            syncedLyrics: this.props.linesData
        });
    }

    fetchSongs = async () => {
        const querySnapshot = await getDocs(collection(db, this.props.collection));
        let data = []
        querySnapshot.forEach((doc) => {
            data.push(doc.data())
        });
        this.setState({
            documents: data
        })
    }

    printData = () => {
        console.log(this.state.documents)
    }
    componentDidMount() {
        this.fetchSongs()
    }

    render() {
        const list = this.state.documents.map((document, index) => {
            return <li key={index}>{document.title}</li>
        })

        return (
            <div>
                <ul>{list}</ul>
                <FormDialog handleUpload={this.writeSong} />
                <button onClick={this.fetchSongs}>get data</button>
                <button onClick={this.printData}>print</button>
            </div>
        )
    }
}



export default DatabaseView;