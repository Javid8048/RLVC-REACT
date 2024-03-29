import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import './Join.css';
import { CustomizedAlert } from '../';
import { db, analytics } from '../../libs';
import { useAlert } from '../../hooks';
import * as ROUTES from '../../routes';
import { ALERT_TYPE, CALL_TYPE } from '../../interfaces';
import { config } from '../../shared';
import { v4 as uuidv4 } from 'uuid';
import Typography from '@material-ui/core/Typography';

export const Join = () => {
  const [name, setName] = useState<string>('');
  const [callID, setCallID] = useState<string>('');
  const { openAlert, setOpenAlert, alertMessage, alertType, fireAlert} = useAlert();
  const history = useHistory();

  const handleCreateCall = () => {
    if (name.length === 0) {
      fireAlert('Please Identify Yourself.', ALERT_TYPE.error);
      return;
    }

    // Analytics
    const _callID = db.collection('calls').doc().id;
    const _userID = uuidv4();
    analytics.logEvent(`create_call`, {
      name,
      callID: _callID,
      _userID: _userID
    });

    // Construct location object to redirect
    const location = {
      pathname: ROUTES.ROOM,
      state: {
        name,
        callID: _callID,
        callType: CALL_TYPE.video,
        userID: _userID,
        action: 'call'
      }
    }
    history.push(location);
  }

  
  const handleJoinCall = () => {
    const main = async () => {
      if (name.length === 0) {
        fireAlert('Please Identify Yourself.', ALERT_TYPE.error);
        return;
      }
      if (callID.length === 0) {
        fireAlert('Invalid Call ID. Please try again with a valid one.', ALERT_TYPE.error);
        return;
      }

      const callDoc = db.collection('calls').doc(callID);
      const testCall = await callDoc.get();
      if (!testCall.exists) {
        fireAlert('Invalid Call ID. Please try again with a valid one.', ALERT_TYPE.error);
        return;
      }
      
      // Analytics
      const _userID = uuidv4();
      analytics.logEvent(`join_call`, {
        name,
        callID,
        _userID: _userID
      });

      // Construct location object to redirect
      const location = {
        pathname: ROUTES.ROOM,
        state: {
          name,
          callID,
          callType: CALL_TYPE.video,
          userID: _userID,
          action: 'answer'
        }
      }
      history.push(location);
    }
    main();
  }

  let [showPage1, setShowPage1] = useState(false);
  const makeACall = () => {
    setShowPage1(true);
  }
  let [showPage2, setShowPage2] = useState(false);
  const joinACall = () => {
    setShowPage2(true);
  }
  const backToHome = () => {
    setShowPage1(false);
    setShowPage2(false);
  }

  return (
    <>
      <div id='joinContainer'>
        <div id='inputContainer'>

        { !showPage1 && !showPage2 && <div className='home-page-layout'>
         <Typography variant="h5" gutterBottom>
            <span id='brand'> Welcome to RLVC</span>
            <br />
            <i className='subBrand'> What you want to do ? </i>
          </Typography>
          <hr />
          <Button id='createCallBtn' variant='contained' onClick={makeACall} disabled={callID.length > 0}>Make a call</Button>
          <hr />
          <Button id='createCallBtn' variant='contained' onClick={joinACall} disabled={callID.length > 0}>Join a call</Button>

         </div>
         }

         { showPage1 && <div className="home-page-layout">
            <Typography variant="h5" gutterBottom>
              <span id='brand'>Make a call</span>
              <br />
              <i className='subBrand'> Enter your name and make a call </i>
            </Typography>
            <TextField id='name' label='Name' variant='standard' value={name} onChange={(e) => setName(e.target.value)}/>
            <Button id='createCallBtn' variant='contained' onClick={handleCreateCall} disabled={callID.length > 0}>Create Call</Button>
            <span className="backBtn" onClick={backToHome}>Back</span>
          </div> }

         { showPage2 && <div className="home-page-layout">
            <Typography variant="h5" gutterBottom>
              <span id='brand'>Join a call</span>
              <br />
              <i className='subBrand'> Enter your name and caller id </i>
            </Typography>
            <TextField id='name' label='Name' variant='standard' value={name} onChange={(e) => setName(e.target.value)}/>
            <TextField id='callID' label='Call ID'  variant='standard' value={callID} onChange={(e) => setCallID(e.target.value)}/>
            <Button id='joinCallBtn' variant='contained' color='secondary' onClick={handleJoinCall} disabled={callID.length === 0}>Join Call</Button>
            <span className="backBtn" onClick={backToHome}>Back</span >
          </div> }
        </div>
      </div>

      <CustomizedAlert duration={5000} openAlert={openAlert} setOpenAlert={setOpenAlert} alertMessage={alertMessage} alertType={alertType}/>
    </>
  )
}