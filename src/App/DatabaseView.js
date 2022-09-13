import React from 'react';
import { db } from './firebaseAPI'
import { collection, getDocs } from 'firebase/firestore';

class DatabaseView extends React.Component {
    async handleClick() {
        const songsCol = collection(db, 'Songs');
        const songsSnapshot = await getDocs(songsCol);
        const songsList =  songsSnapshot.docs.map(doc=>doc.data());
        console.log(songsList[0].lyrics[0].text);
    }

    render() {
        return ( 
            <div>
                <button onClick={this.handleClick}>db</button>
            </div>
        )
    }

}

export default DatabaseView;