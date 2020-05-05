import React from 'react';
import NewSurveyForm from './NewSurveyForm';
import EditSurveyForm from './EditSurveyForm';
import SurveyList from './SurveyList';
import NewResponseForm from './NewResponseForm';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import * as a from '../actions';

function SurveyControl(props) {
  const { dispatch } = props;

  const handleClick = () => {
    if (props.selectedSurvey != null) {
      if (props.editing) {
        const actionOne = a.editSurvey();
        dispatch(actionOne);
      }
      const action = a.unselectSurvey();
      dispatch(action);
    } else {
      const action = a.toggleForm();
      dispatch(action);
      const actionTwo = a.unselectSurvey();
      dispatch(actionTwo);
    }
  };

  const handleSurveyResponse = () => {
    const action = a.unselectSurvey();
    dispatch(action);
  };

  const handleSurveyCreation = () => {
    const action = a.toggleForm();
    dispatch(action);
    const actionTwo = a.unselectSurvey();
    dispatch(actionTwo);
  };

  const handleSurveySelection = (id) => {
    props.firestore.get({collection: 'surveys', doc: id}).then((survey) => {
      const firestoreSurvey = {
        id: id,
        title: survey.get("title"),
        instructions: survey.get("instructions"),
        question1: survey.get("question1"),
        question2: survey.get("question2"),
        question3: survey.get("question3"),
        question4: survey.get("question4"),
        question5: survey.get("question5"),
        question6: survey.get("question6")
      }
      const action = a.selectSurvey(firestoreSurvey);
      dispatch(action);
    });
  };

  const handleSurveyEdit = () => {
    const action = a.editSurvey();
    dispatch(action);
    const actionTwo = a.unselectSurvey();
    dispatch(actionTwo);
  };

  const handleEditClick = (id) => {
    const action = a.editSurvey();
    dispatch(action);
  }

  const handleDeleteClick = () => {
    // delete function
  }

  let currentView = null;
  let buttonText = null;
  if (props.editing) {
    currentView = <EditSurveyForm
      survey={props.selectedSurvey}
      onEditSubmission = {handleSurveyEdit} />
    buttonText = "return to survey list";
  } else if(props.selectedSurvey !== null) {
    currentView = <NewResponseForm 
      survey={props.selectedSurvey}
      onRespondingToSurvey={handleSurveyResponse}
      onEditingSurvey={handleEditClick} />
    buttonText = "return to survey list";
  } else if (props.formVisible) {
    currentView = <NewSurveyForm onNewSurveySubmission={handleSurveyCreation} />
    buttonText = "return to survey list";
  } else {
    currentView = <SurveyList
      onSurveySelection={handleSurveySelection}
      onDeleteClick={handleDeleteClick} />
    buttonText = "create new survey";
  }
  return (
    <React.Fragment>
      <button onClick={handleClick}>{buttonText}</button>
      {currentView}
    </React.Fragment>
  );
}

SurveyList.propTypes = {
  formVisible: PropTypes.bool,
  selectedSurvey: PropTypes.object,
  editing: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    selectedSurvey: state.selectedSurvey,
    formVisible: state.formVisible,
    editing: state.editing
  }
}

SurveyControl = connect(mapStateToProps)(SurveyControl);

export default withFirestore(SurveyControl);