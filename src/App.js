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
  }

  render () {
    return (
      <div className='App'>
        <pre>{this.state.res}</pre>
        <label>
          <input type='text' onChange={this.formHandle.bind(this)} name='name' />
        </label>
        <label>
          <input type='text' onChange={this.formHandle.bind(this)} name='address' />
        </label>
        <button onClick={this.submit.bind(this)}>add</button>
        <ul>{this.state.list}</ul>
      </div>
    )
  }

  formHandle (e) {
    const nstate = {}
    nstate[e.target.name] = e.target.value
    this.setState({
      form: Object.assign(this.state.form, nstate)
    })
  }

  submit () {
    window.fetch('http://localhost:8000/add', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.form)
    }).then(() => {
      this.setState({
        res: 'Success'
      })
    }).catch((e) => {
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
    window.fetch('http://localhost:8000/list')
      .then(res => res.json())
      .then(({data}) => {
        const list = data.map((el, id) => <li key={id}>{el.name}<br />{el.address}</li>)
        this.setState({list})
      })
  }
}

export default App
