import React, {useEffect, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {updateArrangement, getArrangement} from "./firebase";
import UsersTable from "./UsersTable";
import {Input, Radio, Button, Switch} from "antd";

export default function EditArrangement() {
    const {id} = useParams();
    const {push} = useHistory();
    const [arrangement, setArrangement] = useState(null);
    const [selected, setSelected] = useState({keys:[], items: []});

    useEffect(() => {
        (async () => {
            try {
                const data = await getArrangement(id);
                setArrangement(data);
                const persons = JSON.parse(JSON.stringify(data.persons));
                setSelected({
                    keys: persons.map(person => person.sequence),
                    items: persons,
                });
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

    const handleUpdate = async () => {
        const {exam, shift, id, isFinal = false} = arrangement;
        if (!exam || !selected.keys.length) return alert('Please fill all the fields');
        try {
            await updateArrangement(id, {
                exam,
                shift,
                isFinal,
                persons: selected.items,
            });
            push(`/render/${id}`);
        } catch (e) {
            console.log(e);
            alert('unable to update');
        }
    };

    const handleDownload = () => {
        const excludes = arrangement
            .persons.map(person => person.sequence)
            .filter(person => !selected.keys.includes(person));
        push(`/render/${arrangement.id}?exclude=${excludes.join("|")}`);
    };

    const updateField = (data) => {
        setArrangement(p => ({...p, ...data}));
    };

    return (
        <div className="form">
            <Link to="/">Home</Link>
            <br/>
            <br/>
            <h4>Edit Arrangement</h4>
            <br/>
            <div style={{textAlign: "center"}}>Timing - {arrangement.date.day} ({arrangement.date.startTime} TO {arrangement.date.endTime})</div>
            <br/>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Input placeholder="Exam name" value={arrangement.exam} onChange={e => updateField({exam: e.target.value})} style={{ width: '400px' }} />
                <Radio.Group onChange={e => updateField({shift: e.target.value})} value={arrangement.shift} style={{marginLeft: "20px"}}>
                    <Radio value='1'>Shift 1</Radio>
                    <Radio value='2'>Shift 2</Radio>
                    <Radio value='1 & 2'>Both</Radio>
                </Radio.Group>
                <div>
                    &emsp;Is Final &nbsp; <Switch size="small" checked={arrangement.isFinal} onChange={isFinal => updateField({isFinal})} />
                </div>
            </div>
            <br/>
            <UsersTable selected={selected.keys} onSelection={setSelected} />
            <div style={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
                <Button onClick={handleUpdate}>Save Arrangement</Button>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginLeft: "35px"}}>
                    <Button onClick={handleDownload}>Download PDF</Button>
                    <div style={{color: 'red', fontSize: '0.7rem', marginTop: '5px'}}>Only unselect operation will be visible before saving</div>
                </div>
            </div>
        </div>
    );
}
