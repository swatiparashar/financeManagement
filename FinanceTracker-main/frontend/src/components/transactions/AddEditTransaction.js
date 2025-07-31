import React, { useState } from 'react'
import { Form, Input, Modal, Select, message } from 'antd'
import Spinner from '../ui/Spinner'
import axios from 'axios'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants'

function AddEditTransaction({
    setShowAddEditTransactionModal,
    showAddEditTransactionModal,
    selectedItemForEdit,
    setSelectedItemForEdit,
    getTransactions }) {

    const [loading, setLoading] = useState(false)

    const onFinish = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem("Lab-Management-User"))
            setLoading(true)

            let response;
            if (selectedItemForEdit) {
                response = await axios.post('/api/transactions/edit-transaction', {
                    payload: {
                        ...values, userid: user._id,
                    },
                    transactionId: selectedItemForEdit._id
                })
            } else {
                response = await axios.post('/api/transactions/add-transaction', {
                    ...values,
                    userid: user._id
                })
            }

            if (response.data.success) {
                message.success(response.data.message ||
                    (selectedItemForEdit ? 'Transaction updated successfully' : 'Transaction added successfully'))
                getTransactions()
                setShowAddEditTransactionModal(false)
                setSelectedItemForEdit(null)
            } else {
                message.error(response.data.error || 'Operation failed')
            }

            setLoading(false)
        } catch (error) {
            message.error(error.response?.data?.error || 'Something went wrong')
            setLoading(false)
        }
    }
    return (
        <Modal title={selectedItemForEdit ? 'Edit Transaction' : 'Add Transaction'} visible={showAddEditTransactionModal} onCancel={() => setShowAddEditTransactionModal(false)} footer={false}>

            {loading && <Spinner />}

            <Form layout='vertical' className='transaction-form' onFinish={onFinish} initialValues={selectedItemForEdit}>

                <Form.Item label='Amount' name='amount' rules={[
                    {
                        required: true,
                        message: 'Please input the amount!',
                    }]} >
                    <Input prefix="Rs: " type='number' placeholder='Enter amount in Rupees' />
                </Form.Item>

                <Form.Item label='Type' name='type' rules={[
                    {
                        required: true,
                        message: 'Please select the type!'
                    }]}>
                    <Select placeholder='Select transaction type'>
                        <Select.Option value='income'>Income</Select.Option>
                        <Select.Option value='expense'>Expense</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label='Category' name='category' rules={[
                    {
                        required: true,
                        message: 'Please select the category!'
                    }]}>
                    <Select placeholder='Select transaction category'>
                        {INCOME_CATEGORIES.map(category => (
                            <Select.Option key={category} value={category}>{category}</Select.Option>
                        ))}
                        {EXPENSE_CATEGORIES.map(category => (
                            <Select.Option key={category} value={category}>{category}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label='Date' name='date' rules={[
                    {
                        required: true,
                        message: 'Please select the date!'
                    }]}>
                    <Input placeholder='Select transaction date' type='date' />
                </Form.Item>

                <Form.Item label='Reference' name='reference' rules={[
                    {
                        required: true,
                        message: 'Please enter the reference!'
                    }]}>
                    <Input placeholder='Enter transaction reference' type='text' />
                </Form.Item>

                <Form.Item label='Description' name='description' rules={[
                    {
                        required: true,
                        message: 'Please enter description!'
                    }]}>
                    <Input placeholder='Enter transaction description' type='text' />
                </Form.Item>

                <div className="dflex justify-content-end">
                    <button className="primary">Save</button>
                </div>
            </Form>

        </Modal>
    )
}

export default AddEditTransaction
