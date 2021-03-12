import React, { useEffect, Component } from 'react';
import './Machine.css'
import * as SignalR from '@aspnet/signalr';

class Machine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hubConnection: null,
            blocksYZ: [],
            blocksXZ: [],
            blocksXY: [],
            curX: 1,
            curY: 1,
            curZ: 1,
            maxX: 0,
            maxY: 0,
            maxZ: 0,
            startX: 1,
            startY: 1,
            startZ: 1,
            delay: 0,
            delayIter: 0,
            delayX: 0,
            delayY: 0,
            delayZ: 0,
            readyXZ: false,
            readyXY: false,
            readyYZ: false,
            saveX: 0,
            saveY: 0,
            saveZ: 0,
            flagPause: false,
            iXY: 0,
            iXZ: 0,
            iYZ: 0,
            directionXY: "right",
            directionXZ: "right",
            directionYZ: "right",
            curXZx: 0,
            curYZy: 0,
            timeXY: 0,
            stepXXY: 2,
            stepXYStr: 1,
            dirXY: "right",
            stepXXZ: 2,
            stepXZStr: 0,
            dirXZ: "right",
            stepXYZ: 2,
            stepYZStr: 0,
            dirYZ: "right",
            countStepsXY: 0,
            countStepsXZ: 0,
            countStepsYZ: 0,
            skipXZ: false,
            skipStepXZ: 0,
            drawStepXZ: 0,
            skipStepYZ: 0,
            drawStepYZ: 0,
            chgStrYZ: 0,
            isEnd: false,
        };
    }

    componentDidMount() {
        this.setConnection();
        this.setBlocksYZ();
        this.setBlocksXZ();
        this.setBlocksXY();
    }

    setBlocksYZ() {
        var blocks = []
        for (var i = 0; i < 42; i++) {
            if (i % 7 !== 0) {
                blocks.push(<div id={"yz" + i} key={i} className="block-init-yz" style={{ backgroundColor: "black" }} />)
            } else {
                blocks.push(<br key={i} />)
            }
        }
        this.setState({ blocksYZ: blocks })
    }

    setBlocksXZ() {
        var blocks = []
        for (var i = 0; i < 156; i++) {
            if (i % 26 !== 0) {
                blocks.push(<div id={"xz" + i} key={i} className="block-init-xz" style={{ backgroundColor: "black" }} />)
            } else {
                blocks.push(<br key={i} />)
            }
        }
        this.setState({ blocksXZ: blocks })
    }

    setBlocksXY() {
        var blocks = []
        for (var i = 0; i < 156; i++) {
            if (i % 26 !== 0) {
                blocks.push(<div id={"xy" + i} key={i} className="block-init-xy" style={{ backgroundColor: "black" }} />)
            } else {
                blocks.push(<br key={i} />)
            }
        }
        this.setState({ blocksXY: blocks })
    }

    resetBlocksYZ() {
        var blocks = this.state.blocksYZ
        for (var i = 0; i < 42; i++) {
            if (i % 7 !== 0) {
                //console.log(blocks[i].props.id)
                document.getElementById(blocks[i].props.id).style.backgroundColor = "black";
            }
        }
        //this.setState({ blocksYZ: blocks })
    }

    resetBlocksXZ() {
        var blocks = this.state.blocksXZ
        for (var i = 0; i < 156; i++) {
            if (i % 26 !== 0) {
                document.getElementById(blocks[i].props.id).style.backgroundColor = "black";
            }
        }
        //this.setState({ blocksXZ: blocks })
    }

    resetBlocksXY() {
        var blocks = this.state.blocksXY
        for (var i = 0; i < 156; i++) {
            if (i % 26 !== 0) {
                document.getElementById(blocks[i].props.id).style.backgroundColor = "black";
            }
        }
        //console.log(blocks)
        //this.setState({ blocksXY: blocks })
    }

    setConnection() {
        const hubConnection = new SignalR.HubConnectionBuilder().withUrl("/commandhub").build();

        this.setState({ hubConnection }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection.on('ReceiveMessage', (recievedMessage) => {
                //console.log(recievedMessage.split(' '))
                if (recievedMessage !== "end" && recievedMessage[0] !== "x" && recievedMessage[0] !== "y" && recievedMessage[0] !== "c" && recievedMessage[0] !== "z" && recievedMessage[0] !== 's' && recievedMessage[0] !== 'k' && recievedMessage[0] !== 'm') {
                    if (!this.state.flagPause) {
                        this.setState({
                            maxX: recievedMessage.split(' ')[0],
                            maxY: recievedMessage.split(' ')[1],
                            maxZ: recievedMessage.split(' ')[2],
                            delay: recievedMessage.split(' ')[3],
                        }, () => { this.setDelayIter() })
                    }
                    else {
                        //this.conDeleteBlockInXY();
                        //this.conDeleteBlockInXZ();
                        //this.conDeleteBlockInYZ();
                        this.deleteBlockInXZ();
                        this.deleteBlockInYZ();
                        this.deleteBlockInXY();
                    }
                }

                if (recievedMessage[0] === 'm' && recievedMessage[1] === 's') {
                    this.setState({
                        maxX: recievedMessage.split(' ')[1],
                        maxY: recievedMessage.split(' ')[2],
                        maxZ: recievedMessage.split(' ')[3],
                        skipStepXZ: Number(recievedMessage.split(' ')[1]) * (Number(recievedMessage.split(' ')[2]) - 1),
                        drawStepXZ: Number(recievedMessage.split(' ')[1]),
                        skipStepYZ: Number(recievedMessage.split(' ')[1]) - 1,
                        drawStepYZ: 1,
                        chgStrYZ: Number(recievedMessage.split(' ')[1]) * (Number(recievedMessage.split(' ')[2])),
                    })
                }

                if (recievedMessage[0] === 's') {
                    var high = setTimeout(";")
                    for (var i = 0; i < high; i++) {
                        clearInterval(i);
                        this.setState({ flagPause: true })

                    }
                    console.log("stopped")
                }

                if (recievedMessage === "manualstep") {

                    //var high = setTimeout(";")
                    //for (var i = 0; i < high; i++) {
                    //    clearInterval(i);
                    //    this.setState({ flagPause: true })

                    //}
                    this.stepXY();
                    this.stepXZ();
                    this.stepYZ();
                    console.log("step")
                }

                if (recievedMessage[0] === 'k') {
                    var high = setTimeout(";")
                    for (var i = 0; i < high; i++) {
                        clearInterval(i);
                        this.setState({
                            curX: 1,
                            curY: 1,
                            curZ: 1,
                            maxX: 0,
                            maxY: 0,
                            maxZ: 0,
                            startX: 1,
                            startY: 1,
                            startZ: 1,
                            delay: 0,
                            delayIter: 0,
                            delayX: 0,
                            delayY: 0,
                            delayZ: 0,
                            readyXZ: false,
                            readyXY: false,
                            readyYZ: false,
                            saveX: 0,
                            saveY: 0,
                            saveZ: 0,
                            flagPause: false,
                            iXY: 0,
                            iXZ: 0,
                            iYZ: 0,
                            directionXY: "right",
                            directionXZ: "right",
                            directionYZ: "right",
                            curXZx: 0,
                            curYZy: 0,
                            timeXY: 0,
                            stepXXY: 2,
                            stepXYStr: 0,
                        })
                        //this.setState({ flagPause: true })
                    }
                    this.resetBlocksYZ();
                    this.resetBlocksXZ();
                    this.resetBlocksXY();
                    console.log("killed")
                }
            })
        })
    }

    stepXY() {
        if (this.state.stepXYStr !== Number(this.state.maxY) + 1) {
            //var str = this.state.stepXYStr;
            
            var ind = this.state.stepXXY + 26 * this.state.stepXYStr;
            
            //this.sendXY(ind, this.state.stepXYStr)
            this.state.countStepsXY = this.state.countStepsXY + 1;
            if (Number(this.state.countStepsXY) % (Number(this.state.maxX) + 1) === 0) {
                this.state.stepXYStr = this.state.stepXYStr + 1

                ind = this.state.stepXXY + 26 * this.state.stepXYStr;
                this.state.countStepsXY = this.state.countStepsXY + 1;
                if (this.state.dirXY == "right")
                    this.state.dirXY = "left";
                else {
                    this.state.dirXY = "right";
                }
            }
            if (this.state.stepXYStr !== Number(this.state.maxY) + 1) {
                if (this.state.dirXY === "right") {
                    this.sendX(ind % 26)
                    document.getElementById("xy" + Number(ind)).style.backgroundColor = "white";
                    document.getElementById("xy" + Number(ind)).style.border = "1px solid";
                    ind = ind + 1
                } else {
                    
                    ind = ind - 1
                    this.sendX(ind % 26)
                    document.getElementById("xy" + Number(ind)).style.backgroundColor = "white";
                    document.getElementById("xy" + Number(ind)).style.border = "1px solid";
                }

                if (this.state.dirXY === "right") {
                    this.setState({
                        stepXXY: this.state.stepXXY + 1,
                    })
                } else {
                    this.setState({
                        stepXXY: this.state.stepXXY - 1,
                    })
                }
            }
        }

    }

    stepXZ() {
        if (this.state.stepXZStr !== Number(this.state.maxZ)) {
            
            
            if (this.state.drawStepXZ !== 0) {
                //this.sendX(this.state.stepXXZ)
                this.state.drawStepXZ = this.state.drawStepXZ - 1;
                if (this.state.dirXZ === "right") {
                    document.getElementById("xz" + Number(this.state.stepXXZ + 26 * this.state.stepXZStr)).style.backgroundColor = "white";
                    document.getElementById("xz" + Number(this.state.stepXXZ + 26 * this.state.stepXZStr)).style.border = "1px solid";
                    this.sendX(this.state.stepXXZ % 26)
                    this.state.stepXXZ = this.state.stepXXZ + 1;
                    
                } else {
                    //ind = ind - 1
                    this.state.stepXXZ = this.state.stepXXZ - 1;
                    this.sendX(this.state.stepXXZ % 26)
                    document.getElementById("xz" + Number(this.state.stepXXZ + 26 * this.state.stepXZStr)).style.backgroundColor = "white";
                    document.getElementById("xz" + Number(this.state.stepXXZ + 26 * this.state.stepXZStr)).style.border = "1px solid";
                }
            }
            if (this.state.drawStepXZ === 0 && this.state.skipStepXZ !== 0) {
                this.state.skipStepXZ = this.state.skipStepXZ - 1;
            } else if (this.state.skipStepXZ === 0 && this.state.drawStepXZ === 0) {
                this.state.drawStepXZ = Number(this.state.maxX)
                this.state.skipStepXZ = Number(this.state.maxX) * (Number(this.state.maxY) - 1)
                this.state.stepXZStr = this.state.stepXZStr + 1
                if (this.state.dirXZ === "right")
                    this.state.dirXZ = "left"
                else this.state.dirXZ = "right"
            }
            
        }

    }

    sendX(str) {
        this.state.hubConnection
            .invoke('sendToAll', "x " + str, "hi")
            .catch(err => console.error(err));
    }

    sendY(str) {
        this.state.hubConnection
            .invoke('sendToAll', "y " + str, "hi")
            .catch(err => console.error(err));
    }

    stepYZ() {
        if (this.state.stepYZStr !== Number(this.state.maxZ)) {
            this.sendZ(this.state.stepYZStr + 1);
            
            if (this.state.drawStepYZ !== 0) {

                console.log("this.state.drawStepXZ !== 0 | " + this.state.stepXYZ);
                console.log("this.state.drawStepXZ !== 0 ? " + this.state.dirYZ);
                if (this.state.dirYZ === "right") {
                    document.getElementById("yz" + Number(this.state.stepXYZ + 7 * this.state.stepYZStr)).style.backgroundColor = "white";
                    document.getElementById("yz" + Number(this.state.stepXYZ + 7 * this.state.stepYZStr)).style.border = "1px solid";
                    this.sendY((this.state.stepXYZ + 7 * this.state.stepYZStr) % 7)
                    this.state.stepXYZ = this.state.stepXYZ + 1;
                    
                } else {
                    //ind = ind - 1
                    this.state.stepXYZ = this.state.stepXYZ - 1;
                    document.getElementById("yz" + Number(this.state.stepXYZ + 7 * this.state.stepYZStr)).style.backgroundColor = "white";
                    document.getElementById("yz" + Number(this.state.stepXYZ + 7 * this.state.stepYZStr)).style.border = "1px solid";
                }
                this.state.drawStepYZ = this.state.drawStepYZ - 1;
                this.state.chgStrYZ = this.state.chgStrYZ - 1
            }
            if (this.state.drawStepYZ === 0 && this.state.skipStepYZ !== 0) {
                console.log("this.state.drawStepXZ === 0 && this.state.skipStepXZ !== 0");
                this.state.skipStepYZ = this.state.skipStepYZ - 1;
                //this.state.stepXYZ = this.state.stepXYZ + 1;
                this.state.chgStrYZ = this.state.chgStrYZ - 1
            } else if (this.state.skipStepYZ === 0 && this.state.drawStepYZ === 0) {
                console.log("this.state.skipStepXZ === 0 && this.state.drawStepXZ === 0")
                this.state.drawStepYZ = 1
                this.state.skipStepYZ = Number(this.state.maxX) - 1
                console.log("this.state.stepXYZ " + this.state.stepXYZ)
                console.log("this.state.chgStrYZ " + this.state.chgStrYZ)
                if (this.state.chgStrYZ === 0) {
                    this.state.stepYZStr = this.state.stepYZStr + 1
                    if (this.state.dirYZ === "right")
                        this.state.dirYZ = "left"
                    else this.state.dirYZ = "right"
                    this.state.chgStrYZ = Number(this.state.maxX) * Number(this.state.maxY)
                    this.state.skipStepYZ = Number(this.state.maxX) - 1
                    console.log("this.state.stepYZStr aftr " + this.state.stepYZStr)
                }

                console.log(this.state.drawStepYZ)
                console.log(this.state.skipStepYZ)
                console.log(this.state.stepYZStr)
            }

        } else if (!this.state.isEnd) {
            this.state.isEnd = true;
            this.sendEnd();
        }

    }

    setDelayIter() {
        let max = Math.max(this.state.startX + Number(this.state.maxX) - 1, this.state.startY + Number(this.state.maxY) - 1, this.state.startZ + Number(this.state.maxZ) - 1);

        this.setState({
            delayIter: max * this.state.delay,
            delayX: (this.state.startX + Number(this.state.maxX) - 1) * this.state.delay,
            delayY: (this.state.startX + Number(this.state.maxY) - 1) * this.state.delay,
            delayZ: (this.state.startX + Number(this.state.maxZ) - 1) * this.state.delay
        }, () => {
            this.deleteBlockInXZ();
            this.deleteBlockInYZ();
            this.deleteBlockInXY();
            this.setEnd();
        })

    }

    setEnd = () => {
        setTimeout(this.sendEnd, (this.state.delayX * (this.state.maxZ) * this.state.maxY))
    }

    sendEnd = () => {
        console.log((this.state.delayX * (this.state.maxZ - 1) * this.state.maxY))
        this.state.hubConnection
            .invoke('sendToAll', "end", "hi")
            .catch(err => console.error(err));
    }

    rigthMoveXZ(str, count) {
        let interval;
        let ind;
        ind = this.state.startX + 1;

        interval = setInterval(() => {
            document.getElementById("xz" + Number(ind + 26 * str)).style.backgroundColor = "white";
            document.getElementById("xz" + Number(ind + 26 * str)).style.border = "1px solid";
            this.setState({
                directionXZ: "right",
                curXZx: ind,
                iXZ: str,
            })
            ind++;
        }, this.state.delay);
        setTimeout(() => { clearInterval(interval) }, this.state.delayX + 100);
    }

    leftMoveXZ(str) {
        let interval;

        let ind = this.state.startX + Number(this.state.maxX) + 26 * str;
        interval = setInterval(() => {
            document.getElementById("xz" + Number(ind)).style.backgroundColor = "white";
            document.getElementById("xz" + Number(ind)).style.border = "1px solid";
            this.setState({
                directionXZ: "left",
                curXZx: ind,
                iXZ: str,
            })
            ind--
        }, this.state.delay);
        setTimeout(() => { clearInterval(interval); }, this.state.delayX + 100);
    }

    deleteBlockInXZ() {
        for (let i = 0; i < this.state.maxZ; i++) {
            if (i === 0)
                this.rigthMoveXZ(i);
            else {
                if (i % 2 === 0)
                    setTimeout(() => this.rigthMoveXZ(i), this.state.delayX * i * this.state.maxY);
                else setTimeout(() => this.leftMoveXZ(i), this.state.delayX * i * this.state.maxY);
            }
        }
    }

    sendZ(str) {
        this.state.hubConnection
            .invoke('sendToAll', "z " + str, "hi")
            .catch(err => console.error(err));
    }

    rigthMoveYZ(str, count) {
        let interval;
        let ind;
        ind = this.state.startY + 1 + 7 * str;

        interval = setInterval(() => {
            document.getElementById("yz" + Number(ind)).style.backgroundColor = "white"; document.getElementById("yz" + Number(ind)).style.border = "1px solid";
            this.sendZ(str + 1);
            this.setState({
                curY: ind,
                directionYZ: "right",
                iYZ: str,
            })
            ind++;
        }, this.state.delayX);
        setTimeout(() => { clearInterval(interval) }, this.state.delayX * this.state.maxY + 100);
    }

    leftMoveYZ(str) {
        let interval;
        let ind = this.state.startY + Number(this.state.maxY) + 7 * str;

        interval = setInterval(() => {
            document.getElementById("yz" + Number(ind)).style.backgroundColor = "white"; document.getElementById("yz" + Number(ind)).style.border = "1px solid";
            this.sendZ(str + 1);
            this.setState({
                curY: ind,
                directionYZ: "left",
                iYZ: str,
            })
            ind--;
        }, this.state.delayX);
        setTimeout(() => { clearInterval(interval) }, this.state.delayX * this.state.maxY + 100);
    }

    deleteBlockInYZ() {
        for (let i = 0; i < this.state.maxZ; i++) {
            if (i === 0)
                this.rigthMoveYZ(i);
            else {
                if (i % 2 === 0)
                    setTimeout(() => this.rigthMoveYZ(i), this.state.delayX * i * this.state.maxY);
                else setTimeout(() => this.leftMoveYZ(i), this.state.delayX * i * this.state.maxY);
            }
        }
    }

    sendXY(ind, str) {
        this.state.hubConnection
            .invoke('sendToAll', "c " + (ind % 26) + " " + (str), "hi")
            .catch(err => console.error(err));
    }

    rigthMoveXY(str, count) {
        let interval;
        let ind;
        ind = this.state.startX + 27 + 26 * str;

        interval = setInterval(() => {
            document.getElementById("xy" + Number(ind)).style.backgroundColor = "white";
            document.getElementById("xy" + Number(ind)).style.border = "1px solid";
            this.setState({
                curX: ind,
                iXY: str,
                directionXY: "right"
            })
            this.sendXY(ind, str + 1)
            ind++;
        }, this.state.delay);
        setTimeout(() => { clearInterval(interval); }, this.state.delayX + 100);

    }

    leftMoveXY(str) {
        let interval;
        let ind = this.state.startX + Number(this.state.maxX) + 26 * (str + 1);

        interval = setInterval(() => {
            document.getElementById("xy" + Number(ind)).style.backgroundColor = "white";
            document.getElementById("xy" + Number(ind)).style.border = "1px solid";
            this.setState({
                curX: ind,
                iXY: str,
                directionXY: "left"
            })
            this.sendXY(ind, str + 1)
            ind--;
        }, this.state.delay);
        setTimeout(() => { clearInterval(interval); }, this.state.delayX + 100);

    }

    deleteBlockInXY() {
        for (let i = 0; i < this.state.maxY; i++) {
            if (i === 0) {
                this.rigthMoveXY(i);
            }
            else {
                if (i % 2 === 0) {
                    setTimeout(() => this.rigthMoveXY(i), this.state.delayX * i);
                }
                else {
                    setTimeout(() => this.leftMoveXY(i), this.state.delayX * i);
                }
            }
        }
    }

    conRigthMoveXY(str, count) {
        let interval;
        let ind;
        ind = this.state.curX + 27 + 26 * (str - 1);
        console.log(this.state.delayX - this.state.delay * (this.state.curX % 26 - 1) + 100)
        console.log(this.state.maxX - this.state.curX % 26);
        this.setState({ timeXY: this.state.delayX - this.state.delay * (this.state.curX % 26 - 1) + 100 })
        interval = setInterval(() => {
            console.log(ind);
            document.getElementById("xy" + Number(ind)).style.backgroundColor = "white";
            document.getElementById("xy" + Number(ind)).style.border = "1px solid";
            this.setState({
                curX: ind,
                iXY: str,
                directionXY: "right"
            })
            this.sendXY(ind, str + 1)
            ind++;
        }, this.state.delay);
        setTimeout(() => { clearInterval(interval); }, this.state.delayX - this.state.delay * (this.state.curX % 26 - 1) + 100);

    }

    conLeftMoveXY(str) {
        let interval;
        let ind = this.state.curX - 1;
        console.log(this.state.delay * (this.state.curX % 26 - 2) + 100 + " XY")
        console.log(this.state.curX);
        console.log(this.state.curX % 26 - 2);
        this.setState({ timeXY: this.state.delay * (this.state.curX % 26 - 2) + 100 })
        interval = setInterval(() => {
            console.log(ind);
            document.getElementById("xy" + Number(ind)).style.backgroundColor = "white";
            document.getElementById("xy" + Number(ind)).style.border = "1px solid";
            this.setState({
                curX: ind,
                iXY: str,
                directionXY: "left"
            })
            this.sendXY(ind, str + 1)
            ind--;
        }, this.state.delay);
        setTimeout(() => { clearInterval(interval); }, this.state.delay * (this.state.curX % 26 - 2) + 100);

    }

    conDeleteBlockInXY() {
        console.log("go")
        var skip = true;
        for (let i = this.state.iXY; i < this.state.maxY; i++) {
            if (skip) {
                if (this.state.directionXY === "right")
                    this.conRigthMoveXY(i);
                else this.conLeftMoveXY(i);
                skip = false;
            } else {
                if (i % 2 === 0) {
                    setTimeout(() => this.rigthMoveXY(i), this.state.delayX * i);
                }
                else {
                    setTimeout(() => this.leftMoveXY(i), this.state.delayX * i);
                }
            }

        }
    }

    conRigthMoveXZ(str, count) {
        let interval;
        let ind;
        ind = this.state.curX + 1 + 26 * (str - 1);

        interval = setInterval(() => { document.getElementById("xz" + Number(ind)).style.backgroundColor = "white"; document.getElementById("xz" + Number(ind)).style.border = "1px solid"; ind++ }, this.state.delay);
        setTimeout(() => { clearInterval(interval) }, this.state.delayX - this.state.delay * (this.state.curX % 26 - 1) + 100);
    }

    conLeftMoveXZ(str) {
        let interval;

        let ind = this.state.curX
        interval = setInterval(() => { document.getElementById("xz" + Number(ind + 26 * str)).style.backgroundColor = "white"; document.getElementById("xz" + Number(ind + 26 * str)).style.border = "1px solid"; ind-- }, this.state.delay);
        setTimeout(() => { clearInterval(interval); }, this.state.delay * (this.state.curX % 26 - 2) + 100);
    }

    conDeleteBlockInXZ() {
        var skip = true;
        let start = this.state.iXZ;
        //console.log(this.state.iXZ + " ixz")
        //console.log((this.state.curXZx % 26 - 1) + " %26 ")
        //console.log((this.state.curXZx % 26 - 1) === this.state.maxX)
        //console.log(this.state.maxX)
        if (Number(this.state.curXZx % 26 - 1) === Number(this.state.maxX)) {
            start = start + 1;
            console.log("start=" + start)
        }

        for (let i = start; i < this.state.maxZ; i++) {
            if (skip && ((this.state.curXZx % 26 - 1) < this.state.maxX)) {
                //console.log(this.state.curXZx % 26 - 1)
                //console.log(this.state.timeXY + " time")
                if (this.state.directionXZ === "right")
                    this.conRigthMoveXZ(i);
                else this.conLeftMoveXZ(i);
                //if ((this.state.curXZx % 26 - 1) !== this.state.maxX) {
                //    if (this.state.directionXZ === "right")
                //        this.conRigthMoveXZ(i);
                //    else this.conLeftMoveXZ(i);
                //} else {
                //    //this.setState({})
                //    //if (this.state.directionXZ === "right")
                //    setTimeout(() => this.conLeftMoveXZ(i), this.state.timeXY);

                //}
                skip = false;
            } else {
                //console.log("more")
                //console.log(this.state.timeXY + " time")
                if (skip) {
                    //console.log("more x " + this.state.curXZx)
                    //console.log("more x %" + this.state.curXZx % 26)
                    if (i % 2 === 0) {
                        //console.log("more r " + i)
                        setTimeout(() => this.conRigthMoveXZ((i)), this.state.timeXY);
                    }
                    else {
                        //console.log("more l " + i)
                        setTimeout(() => this.leftMoveXZ((i)), this.state.timeXY);
                    }
                    skip = false;
                }
                if (i % 2 === 0) {
                    setTimeout(() => this.rigthMoveXZ(i), this.state.delayX * i * this.state.maxY);
                }
                else {
                    setTimeout(() => this.leftMoveXZ(i), this.state.delayX * i * this.state.maxY + this.state.timeXY);
                }
            }
        }
    }

    conRigthMoveYZ(str, count) {
        let interval;
        let ind;
        ind = this.state.curY + 1;
        console.log(this.state.curY)
        interval = setInterval(() => {
            console.log("item" + ind)
            document.getElementById("yz" + Number(ind + 7 * str)).style.backgroundColor = "white"; document.getElementById("yz" + Number(ind + 7 * str)).style.border = "1px solid";
            this.sendZ(str + 1);
            ind++;
        }, this.state.timeXY);
        setTimeout(() => { clearInterval(interval) }, this.state.timeXY + 100);
    }

    conLeftMoveYZ(str) {
        let interval;
        let ind = this.state.curY;

        interval = setInterval(() => {
            document.getElementById("yz" + Number(ind + 7 * str)).style.backgroundColor = "white"; document.getElementById("yz" + Number(ind + 7 * str)).style.border = "1px solid";
            this.sendZ(str + 1);
            ind--;
        }, this.state.delayX);
        setTimeout(() => { clearInterval(interval) }, this.state.delayX * this.state.maxY + 100);
    }

    conDeleteBlockInYZ() {
        let start = this.state.iYZ;
        var skip = true;
        //console.log(this.state.iXZ + " ixz")
        //console.log((this.state.curXZx % 26 - 1) + " %26 ")
        //console.log((this.state.curXZx % 26 - 1) === this.state.maxX)
        //console.log(this.state.maxX)
        if (Number(this.state.curY % 7 - 1) === Number(this.state.maxY)) {
            start = start + 1;
            console.log("start=" + start)
        }

        for (let i = start; i < this.state.maxZ; i++) {
            //if (i === 0)
            //    this.rigthMoveYZ(i);
            //else {
            //    if (i % 2 === 0)
            //        setTimeout(() => this.rigthMoveYZ(i), this.state.delayX * i * this.state.maxY);
            //    else setTimeout(() => this.leftMoveYZ(i), this.state.delayX * i * this.state.maxY);
            //}
            if (skip && ((this.state.curY % 7 - 1) < this.state.maxY)) {
                console.log(this.state.curY % 7 - 1)
                console.log(this.state.timeXY + " time")
                if (this.state.directionYZ === "right")
                    this.conRigthMoveYZ(i);
                else this.conLeftMoveYZ(i);
                //if ((this.state.curXZx % 26 - 1) !== this.state.maxX) {
                //    if (this.state.directionXZ === "right")
                //        this.conRigthMoveXZ(i);
                //    else this.conLeftMoveXZ(i);
                //} else {
                //    //this.setState({})
                //    //if (this.state.directionXZ === "right")
                //    setTimeout(() => this.conLeftMoveXZ(i), this.state.timeXY);

                //}
                skip = false;
            } else {
                console.log("more " + i)
                console.log(this.state.timeXY + " time")
                if (skip) {
                    console.log("more x " + this.state.curY)
                    console.log("more x %" + this.state.curY % 7)
                    if (i % 2 === 0) {
                        console.log("more r " + i)
                        setTimeout(() => this.rigthMoveYZ((i)), this.state.timeXY);
                    }
                    else {
                        console.log("more l " + i)
                        setTimeout(() => this.leftMoveYZ((i)), this.state.timeXY);
                    }
                    skip = false;
                }
                if (i % 2 === 0) {
                    setTimeout(() => this.rigthMoveYZ(i), this.state.delayX * i * this.state.maxY);
                }
                else {
                    setTimeout(() => this.leftMoveYZ(i), this.state.delayX * i * this.state.maxY);
                }
            }
        }
    }

    render() {
        return (
            <div className="container-form">
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Станок</h2>
                <div className="container-row-first">
                    <div className="container-xz">
                        <h5 style={{ textAlign: "center", marginBottom: "20px" }}>Вид сбоку XZ</h5>
                        <div className="container-center">
                            {
                                this.state.blocksXZ
                                    ?
                                    this.state.blocksXZ.map((item, index) => {
                                        return item;
                                    })
                                    : null
                            }
                        </div>
                    </div>
                    <div className="container-yz">
                        <h5 style={{ textAlign: "center", marginBottom: "20px" }}>Вид спереди YZ</h5>
                        <div className="container-center">
                            {
                                this.state.blocksYZ
                                    ?
                                    this.state.blocksYZ.map((item, index) => {
                                        return item;
                                    })
                                    : null
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className="container-xy">
                        <h5 style={{ textAlign: "center", marginBottom: "20px" }}>Вид сверху XY</h5>
                        <div className="container-center">
                            {
                                this.state.blocksXY
                                    ?
                                    this.state.blocksXY.map((item, index) => {
                                        return item;
                                    })
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Machine;
