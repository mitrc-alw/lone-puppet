import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {getInvigilators} from "./firebase";

const columns = [
    {
        title: 'Application Seq No',
        dataIndex: 'sequence',
    },
    {
        title: 'Exam Role',
        dataIndex: 'role',
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
    },
    {
        title: 'Date of Birth(dd/MM/yyyy)',
        dataIndex: 'dob',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Father Name',
        dataIndex: 'fatherName',
    },
    {
        title: 'Employee Contact No.',
        dataIndex: 'contact',
    },
    {
        title: 'Whatsapp Number',
        dataIndex: 'waNumber',
    },
    {
        title: 'Employee Email ID',
        dataIndex: 'email',
    },
    {
        title: 'Highest Qualification',
        dataIndex: 'qualification',
    },
    {
        title: 'Govt. ID Proof Type',
        dataIndex: 'proofType',
    },
    {
        title: 'Govt. ID Proof No.',
        dataIndex: 'proofNo',
    },
];

export default function UsersTable({ data: rows, selected: selectedRowKeys, onSelection: onChange }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInit = async () => {
        setLoading(true);
        try {
            const res = await getInvigilators();
            setData(res);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (rows) {
            setData(rows);
        } else if (selectedRowKeys && onChange && data.length < 1) {
            handleInit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    let extra = {};
    if (selectedRowKeys && onChange) extra = {
        rowSelection: {
            selectedRowKeys,
            onChange: (keys, items) => onChange({keys, items})
        }
    };
    return (
        <Table rowKey='sequence' dataSource={data} columns={columns} {...extra} loading={loading}  />
    );
}
