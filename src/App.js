import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      res: 'Not Sent',
      form: {},
      list: null
    }
    this._formHandle = this._formHandle.bind(this)
    this._submitForm = this._submitForm.bind(this)
  }

  render () {
    return (
      <div className='App'>
        <pre>{this.state.res}</pre>
        <label>
          Name:&nbsp;
          <input
            type='text'
            name='name'
            onChange={this._formHandle}
            value={this.state.form.name}
          />
        </label>
        <label>
          Address:&nbsp;
          <input
            type='text'
            name='address'
            onChange={this._formHandle}
            value={this.state.form.address}
          />
        </label>
        <button onClick={this._submitForm}>ADD</button>
        <ul>{this.state.list}</ul>
      </div>
    )
  }

  _formHandle (e) {
    const nstate = {}
    nstate[e.target.name] = e.target.value
    this.setState({ form: Object.assign(this.state.form, nstate) })
  }

  _submitForm () {
    window
      .fetch('http://localhost:8000/add', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.form)
      })
      .then(res => {
        // status code other than 200 means server sent error
        if (res.status === 200) {
          this.setState({
            res: 'Success',
            form: {
              name: '',
              address: ''
            }
          })
        } else {
          throw new Error(res.status)
        }
      })
      .catch(e => {
        console.log(e)
        this.setState({
          res: 'Failed!'
        })
      })
  }
  componentDidMount () {
    this.componentDidUpdate()
  }

  componentDidUpdate () {
    window
      .fetch('http://localhost:8000/list')
      .then(res => res.json())
      .then(({ data }) => {
        const list = data.map((el, id) => (
          <li key={id}>{el.name}<br />{el.address}</li>
        ))
        this.setState({ list })
      })
  }
}

export default App
