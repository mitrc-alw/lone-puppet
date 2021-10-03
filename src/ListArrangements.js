import React, {useEffect, useState} from "react";
import {deleteArrangement, getArrangements} from "./firebase";
import {Button, List} from "antd";
import {Link} from "react-router-dom";

export default function ListArrangements() {
    const [arrs, setArrs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await getArrangements();
                setArrs(data);
            } catch (e) {
                console.log(e);
                alert('failed to load');
            }
            setLoading(false);
        })();
    }, []);

    const handleDelete = async (id) => {
        const choice = window.confirm("Are you sure want to delete?");
        if (choice) {
            try {
                await deleteArrangement(id);
                setArrs(p => p.filter(arr => arr.id !== id));
            } catch (e) {
                console.log(e);
                alert('unable to delete');
            }
        }
    };

    return (
        <div>
            <h4>Arrangements</h4>
            <List
                itemLayout="horizontal"
                bordered
                dataSource={arrs}
                loading={loading}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Link to={`render/${item.id}`}>Download PDF</Link>,
                            <Link to={`edit/${item.id}`}>Edit</Link>,
                            <Button type='link' onClick={() => handleDelete(item.id)}>Delete</Button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={item.isFinal ? <div className="final">Final</div> : null}
                            title={`${item.exam} (SHIFT - ${item.shift})`}
                            description={`Timing - ${item.date.day} (${item.date.startTime} TO ${item.date.endTime})`}
                        />
                        <div>
                            {item.persons.length} Person(s) on Duty
                            <div style={{color: 'grey', fontSize: '0.8em'}}>Created at - {Date(item.createdAt).toLocaleString().substring(4, 21)}</div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}
