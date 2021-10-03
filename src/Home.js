import readXlsxFile, {Email} from 'read-excel-file'
import 'antd/dist/antd.css';
import './App.css';
import {Tabs, Button} from "antd";
import {useState} from "react";
import {setInvigilators} from "./firebase";
import Prepare from "./Prepare";
import UsersTable from "./UsersTable";
import ListArrangements from "./ListArrangements";

const { TabPane } = Tabs;

const schema = {
    'Application Seq No': {
        prop: 'sequence',
        type: Number,
        required: true,
    },
    'Exam Role': {
        prop: 'role',
        type: String,
        oneOf: [
            'Invigilator',
            'Registration Manager',
            'Network and Hardware Support',
            'Multi Tasking Staff',
            'Lab Supervisor',
            'Software Support Engineer',
            'Surveillance Monitor',
            'Venue Manager',
            'Admin Incharge',
        ]
    },
    'First Name': {
        prop: 'firstName',
        type: String,
    },
    'Last Name': {
        prop: 'lastName',
        type: String,
    },
    'Date of Birth(dd/MMM/yyyy)': {
        prop: 'dob',
        type: String,
    },
    'Age': {
        prop: 'age',
        type: Number,
    },
    'Father Name': {
        prop: 'fatherName',
        type: String,
    },
    'Employee Contact No.': {
        prop: 'contact',
        type: Number,
    },
    'Whatsapp Number': {
        prop: 'waNumber',
        type: Number,
    },
    'Employee Email ID': {
        prop: 'email',
        type: Email,
    },
    'Highest Qualification': {
        prop: 'qualification',
        type: String,
        oneOf: [
            'Doctorate',
            'Post Graduate',
            'Graduate',
            'Intermediate',
            'High School',
        ]
    },
    'Govt. ID Proof Type': {
        prop: 'proofType',
        type: String,
        oneOf: [
            'Aadhar Card',
            'PAN Card',
            'Voter Id',
            'Driving License',
            'Passport',
            'Bank Pass Book',
        ]
    },
    'Govt. ID Proof No.': {
        prop: 'proofNo',
        type: String,
    },
};

export default function App() {
    const [rows, setRows] = useState([]);
    const [errors, setErrors] = useState(null);

    const handleFile = async (e) => {
        const {rows, errors} = await readXlsxFile(e.target.files[0], {schema});
        setRows(rows)
        setErrors(errors)
    };

    const addRows = async () => {
        if (errors && errors.length) return alert('Please resolve all the errors');
        try {
            await setInvigilators(rows);
            alert("Added all rows");
        } catch (e) {
            console.log(e);
            setErrors(["unable to add to db"]);
        }
        setRows([]);
    };

    return (
        <div className="App">
            <Tabs defaultActiveKey="1">
                <TabPane tab="Add persons" key="1">
                    <h4>Add Persons</h4>
                    <br/>
                    <input type="file" onChange={handleFile} />
                    <br/><br/>
                    <br/><br/>
                    <div style={{color :'red'}}>{errors && errors.length > 0 && JSON.stringify(errors)}</div>
                    <UsersTable data={rows} />
                    <br/><br/>
                    <Button disabled={!rows.length} onClick={addRows}>Save Persons</Button>
                </TabPane>
                <TabPane tab="Prepare arrangement" key="2">
                    <Prepare />
                </TabPane>
                <TabPane tab="List arrangements" key="3">
                    <ListArrangements />
                </TabPane>
                <TabPane tab="Info" key="4">
                    <div>
                        <br/>
                        <br/>
                        <h4>Info</h4>
                        <br/>
                        <br/>
                        <div>Generate duty given from <b>List arrangements -> Edit -> Unselect absentees -> Download PDF</b></div>
                        <div>Make an arrangement final from <b>List arrangements -> Edit -> Toggle the final switch -> Save Arrangement</b></div>
                        <div>Update an arrangement <b>List arrangements -> Edit -> Edit fields -> Save Arrangement</b></div>
                        <div>Add More Persons <b>Add persons -> Upload Xls -> Remove mentioned errors if any -> Add</b></div>
                        <br/>
                        <br/>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{ width: '70vw' }}>
                                <i>
                                    Note: Application sequence should be unique among the persons.
                                    Please make sure before uploading the xls that no same sequence is
                                    present in the xls and the database. <br/>
                                    However if you want to replace the previous database entry with the new one, you
                                    can upload with the same key.
                                </i>
                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
}
