import React, { Component, useEffect } from 'react';
import './Operator.css'
import * as SignalR from '@aspnet/signalr';

class Operator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countNotifies: 0,
            companyName: '',
            message: "1",
            messages: [],
            hubConnection: null,
            nick: "operator",
            countInside: 0,
            workMode: "auto",
            curX: 0,
            curY: 0,
            curZ: 0,
            maxX: 10,
            maxY: 2,
            maxZ: 2,
            delay: 500
        };
    }

    componentDidMount() {
        this.setConnection();
        const onKeypress = e => console.log(e);

        document.addEventListener('keypress', onKeypress);

        return () => {
            document.removeEventListener('keypress', onKeypress);
        };
        
    }

    sendCommands = () => {
        var commands = this.state.maxX + " " + this.state.maxY + " " + this.state.maxZ + " " + this.state.delay

        this.state.hubConnection
            .invoke('sendToAll', commands, "hi")
            .catch(err => console.error(err));
    }

    sendStop = () => {
        var commands = "stop"

        this.state.hubConnection
            .invoke('sendToAll', commands, "hi")
            .catch(err => console.error(err));
    }

    sendKill = () => {
        var commands = "kill"

        this.state.hubConnection
            .invoke('sendToAll', commands, "hi")
            .catch(err => console.error(err));
    }

    sendManual = () => {
        var commands = "manualstep"

        this.state.hubConnection
            .invoke('sendToAll', commands, "hi")
            .catch(err => console.error(err));
    }

    sendCommandsManual = () => {
        var commands = "ms " + this.state.maxX + " " + this.state.maxY + " " + this.state.maxZ + " " + this.state.delay

        this.state.hubConnection
            .invoke('sendToAll', commands, "hi")
            .catch(err => console.error(err));
    }

    setConnection() {
        const hubConnection = new SignalR.HubConnectionBuilder().withUrl("/commandhub").build();

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection.on('ReceiveMessage', (recievedMessage) => {
                console.log(recievedMessage)
                if (recievedMessage[0] === "c") {
                    this.setState({
                        curX: recievedMessage.split(' ')[1],
                        curY: recievedMessage.split(' ')[2]
                    })
                }
                if (recievedMessage[0] === "z") {
                    this.setState({
                        curZ: recievedMessage.split(' ')[1],
                    })
                }

                if (recievedMessage[0] === "x") {
                    this.setState({
                        curX: recievedMessage.split(' ')[1],
                    })
                }

                if (recievedMessage[0] === "y") {
                    this.setState({
                        curY: recievedMessage.split(' ')[1],
                    })
                }
                if (recievedMessage === "end")
                    alert("Деталь готова!")
            })
        })
    }

    handleChangeMode = (event) => {
        this.setState({ workMode: event.target.value })
        if (event.target.value === "manual")
            this.sendCommandsManual();
    }

    handleChangeCurX = (event) => {
        this.setState({ curX: event.target.value })
    }

    handleChangeCurY = (event) => {
        this.setState({ curY: event.target.value })
    }

    handleChangeCurZ = (event) => {
        this.setState({ curZ: event.target.value })
    }

    handleChangeMaxX = (event) => {
        this.setState({ maxX: event.target.value })
    }

    handleChangeMaxY = (event) => {
        this.setState({ maxY: event.target.value })
    }

    handleChangeMaxZ = (event) => {
        this.setState({ maxZ: event.target.value })
    }

    handleChangeDelay = (event) => {
        this.setState({ delay: event.target.value })
    }

    render() {
        return (
            <div className="container-form">
                <div className="container-center">
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Пульт оператора</h2>
                    <div>
                        <label>XMAX</label>
                        <input className="container-form-input" value={this.state.maxX} onChange={this.handleChangeMaxX} placeholder="Введите XMAX от 1 до 23" />
                    </div>
                    <div>
                        <label>YMAX</label>
                        <input className="container-form-input" value={this.state.maxY} onChange={this.handleChangeMaxY} placeholder="Введите YMAX от 1 до 4" />
                    </div>
                    <div>
                        <label>ZMAX</label>
                        <input className="container-form-input" value={this.state.maxZ} onChange={this.handleChangeMaxZ} placeholder="Введите ZMAX от 1 до 5" />
                    </div>
                    <div>
                        <label>TZAD</label>
                        <input className="container-form-input" value={this.state.delay} onChange={this.handleChangeDelay} placeholder="Введите задержку между итерациями от 300 до 5000" />
                    </div>
                    <div className="container-current">
                        <label>XCUR</label>
                        <input className="input-current-coors" value={this.state.curX} onChange={this.handleChangeCurX} />
                    </div>
                    <div>
                        <label>YCUR</label>
                        <input className="input-current-coors" value={this.state.curY} onChange={this.handleChangeCurY} />
                    </div>
                    <div>
                        <label>ZCUR</label>
                        <input className="input-current-coors" value={this.state.curZ} onChange={this.handleChangeCurZ} />
                    </div>
                    <div className="container-current">
                        <div>
                            <label>Режим работы</label>
                            <select className="input-current-coors" value={this.state.workMode} onChange={this.handleChangeMode}>
                                <option value="auto">Автоматический</option>
                                <option value="manual">Ручной</option>
                            </select>
                            {
                                this.state.workMode === "manual"
                                    ? <button className="button-step" onClick={this.sendManual}>Сделать шаг</button>
                                    : null
                            }
                        </div>
                    </div>
                    <div className="container-buttons">
                        <button onClick={this.sendCommands}>Начать процесс</button>
                        <button onClick={this.sendStop}>Стоп процесс</button>
                        <button onClick={this.sendKill}>Конец процесс</button>
                    </div>
                    <div className="container-commands">
                        {
                    //        Клавиши для управления:<br />
                    //А - автоформат<br />
                    //Р - ручной<br />
                    //Н - настройка<br />
                    //П - пуск<br />
                    //Ш - шаг<br />
                    //С - стоп<br />
                    //К - конец работы<br />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Operator;
