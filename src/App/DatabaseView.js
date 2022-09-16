import { db } from './firebaseAPI'
import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

class DatabaseView extends React.Component {
    constructor(props) {
        super(props)
        this.state = { documents: [] }
    }

    fetchBlogs = async () => {
        const querySnapshot = await getDocs(collection(db, this.props.collection));
        let data = []
        console.log(querySnapshot)
        querySnapshot.forEach((doc) => {
            data.push(doc.data())
        });
        this.setState({
            documents: data
        })
        console.log(data)
    }

    printData = () => {
        console.log(this.state.documents)
    }
    componentDidMount() {
        this.fetchBlogs()
    }

    render() {
        const list  = this.state.documents.map((document, index) => {
             return <li key={index}>{document.title}</li>
        })

        return (
            <div>
                <ul>{list}</ul>
                <button onClick={this.fetchBlogs}>get data</button>
                <button onClick={this.printData}>print</button> // for testing
            </div>
        )
    }
}



export default DatabaseView;