import React, {useState} from "react";
import {DatePicker, Input, Radio, Button} from "antd";
import UsersTable from "./UsersTable";
import {addArrangement} from "./firebase";
import {useHistory} from "react-router-dom";

const { RangePicker } = DatePicker;

export default function Prepare() {
    const {push} = useHistory();
    const [exam, setExam] = useState('');
    const [shift, setShift] = useState('1');
    const [date, setDate] = useState(null);
    const [selected, setSelected] = useState({keys:[], items: []});

    const handleDates = (dates) => {
        const [date1, date2] = dates;
        setDate({
            day: date1.format('DD MMMM YYYY'),
            startTime: date1.format('h:mm A'),
            endTime: date2.format('h:mm A'),
        });
    };

    const handlePrepare = async () => {
        if (!exam || !date || !selected.keys.length) return alert('Please fill all the fields');
        try {
            const id = await addArrangement({
                exam,
                shift,
                date,
                persons: selected.items,
                createdAt: Date.now(),
            });
            push(`/render/${id}`);
        } catch (e) {
            console.log(e);
            alert('unable to prepare');
        }
    };

    return (
        <div className='form'>
            <h4>Prepare Arrangement</h4>
            <Input placeholder="Exam name" value={exam} onChange={e => setExam(e.target.value)} style={{ width: '400px' }} />
            <br/>
            <br/>
            <Radio.Group onChange={e => setShift(e.target.value)} value={shift}>
                <Radio value='1'>Shift 1</Radio>
                <Radio value='2'>Shift 2</Radio>
                <Radio value='1 & 2'>Both</Radio>
            </Radio.Group>
            <RangePicker format='DD-MM-YYY HH:mm' showTime onChange={handleDates} />
            <br/>
            <br/>
            <UsersTable selected={selected.keys} onSelection={setSelected} />
            <Button onClick={handlePrepare}>Prepare</Button>
        </div>
    );
}
