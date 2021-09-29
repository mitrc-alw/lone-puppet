import React, {useEffect, useState} from "react";
import {getArrangements} from "./firebase";
import {List} from "antd";
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
                        actions={[<Link to={`render/${item.id}`}>Download PDF</Link>]}
                    >
                        <List.Item.Meta
                            title={`${item.exam} (SHIFT - ${item.shift})`}
                            description={`Timing ${item.date.startTime} TO ${item.date.endTime}`}
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
