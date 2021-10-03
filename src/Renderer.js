import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text, View} from "@react-pdf/renderer";
import React, {useEffect, useState} from "react";
import {Link, useParams, useLocation} from "react-router-dom";
import queryString from 'query-string';
import {getArrangement} from "./firebase";

export default function Renderer() {
    const {id} = useParams();
    const {search} = useLocation();
    const [arrangement, setArrangement] = useState(null);
    let { exclude = []} = queryString.parse(search, {arrayFormat: 'separator', arrayFormatSeparator: '|'});
    exclude = Array.isArray(exclude) ? exclude : [exclude];

    useEffect(() => {
        (async () => {
            try {
                const data = await getArrangement(id);
                data.persons = data.persons.filter(person => !exclude.includes(String(person.sequence)))
                setArrangement(data);
            } catch (e) {
                console.log(e);
                alert('unable to load arrangement ' + id)
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!arrangement) return (
        <div className="form">
            <Link to="/">Home</Link>
            <br/>
            <br/>
            Loading...
        </div>
    );

    const Element = () => {
        return (
            <Document>
                <Page size="A4" style={styles.page} orientation='landscape'>
                    <View style={styles.head}>
                        <View style={styles.headline}>
                            <Text style={styles.red}>MANPOWER DETAILS FOR</Text>
                            <Text style={styles.green}>{arrangement.exam}</Text>
                            <Text style={styles.red}>ONLINE EXAM TO BE HELD ON</Text>
                        </View>
                        <View style={styles.headline}>
                            <Text style={styles.red}>{arrangement.date.day}</Text>
                            <Text
                                style={styles.green}>(Timing {arrangement.date.startTime} TO {arrangement.date.endTime})</Text>
                            <Text style={styles.black}>(SHIFT {arrangement.shift})</Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.rowHead}>
                            {keys.map((key, i) => (
                                <Text style={[styles.col, styles[`col${i}`], styles.headCol]} key={key}>{key}</Text>
                            ))}
                        </View>
                        {arrangement.persons.map((item, i) => (
                            <View style={styles.row} key={item.sequence}>
                                <Text style={[styles.col, styles.col0]}>{i + 1}</Text>
                                <Text style={[styles.col, styles.col1]}>{item.firstName + " " + item.lastName}</Text>
                                <Text style={[styles.col, styles.col2]}>{item.fatherName}</Text>
                                <Text style={[styles.col, styles.col3]}>MITRC</Text>
                                <Text style={[styles.col, styles.col4]}>CSE</Text>
                                <Text style={[styles.col, styles.col5]}>{item.email}</Text>
                                <Text style={[styles.col, styles.col6]}>{item.contact}</Text>
                                <Text style={[styles.col, styles.col7]}>{item.role}</Text>
                                <View style={[styles.col, styles.col8]}/>
                            </View>
                        ))}
                    </View>

                    <View style={styles.bottom}>
                        <View style={styles.bottomContent}>
                            <Text style={styles.blackSmall}>FOR ANY QUERY, PLEASE CONTACT</Text>
                            <Text style={styles.red}>DEEPAK SHARMA, Contact 0144-2731596 (9:00 AM TO 5:00 PM)</Text>
                            <Text style={[styles.red, {marginTop: 2}]}>TCA, MITRC CENTRE (1270) - ALWAR</Text>
                        </View>
                        <View style={styles.bottomSign}/>
                    </View>
                </Page>
            </Document>
        );
    };

    return (
        <div className="form">
            <Link to="/">Home</Link>
            <br/>
            <br/>
            <PDFDownloadLink document={<Element/>} fileName={`${arrangement.exam}-shift-${arrangement.shift}-${arrangement.date.day}`.replaceAll(' ', '-')}>
                {({blob, url, loading, error}) =>
                    loading ? 'Loading document...' : 'Download now!'
                }
            </PDFDownloadLink>
        </div>
    );
}


const keys = [
    'S No.',
    'Name of Staff Appointed',
    "Father's Name",
    "Duty Report Centre",
    "Deptt.",
    "E-mail Id",
    "Contact No.",
    "Role",
    "Signature"
];

Font.register({
    family: 'Open Sans',
    fonts: [
        {src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf'},
        {src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600}
    ]
});

const styles = StyleSheet.create({
    red: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 4,
        fontFamily: 'Open Sans',
    },
    green: {
        color: 'green',
        fontSize: 10,
        fontWeight: 'ultrabold',
        marginRight: 4,
        fontFamily: 'Open Sans',
    },
    black: {
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 4,
        fontFamily: 'Open Sans',
    },
    blackSmall: {
        fontWeight: 'bold',
        fontSize: 8,
        marginBottom: 2,
        fontFamily: 'Open Sans',
    },
    page: {
        paddingTop: 10,
        paddingHorizontal: 5,
    },
    head: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headline: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 4,
    },
    table: {
        marginTop: 10,
    },
    rowHead: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 9,
        backgroundColor: '#FFC270',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        fontFamily: 'Open Sans',
    },
    row: {
        fontSize: 8,
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    bottom: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    bottomContent: {
        textAlign: 'center',
        flex: 1,
        borderLeftWidth: 1,
        paddingVertical: 5,
    },
    bottomSign: {
        width: 57.5,
        borderRightWidth: 1,
        borderLeftWidth: 1,
    },
    headCol: {
        paddingLeft: 0,
        textAlign: 'center',
        fontWeight: 600,
        paddingVertical: 10,
    },
    col: {
        borderRightWidth: 1,
        paddingVertical: 7,
        paddingLeft: 5,
    },
    col0: {
        width: 40,
        borderLeftWidth: 1,
    },
    col1: {
        width: 120,
    },
    col2: {
        width: 120,
    },
    col3: {
        width: 110,
    },
    col4: {
        width: 110,
    },
    col5: {
        width: 115,
    },
    col6: {
        width: 65,
    },
    col7: {
        width: 95,
    },
    col8: {
        width: 57,
        borderRightWidth: 1,
    },
});
