import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import withStyles from '@material-ui/core/styles/withStyles';

import { authService } from '../../services/index';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    padding: `0px ${theme.spacing(3)}px 5px`,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

class SignIn extends React.Component {
  state = {
    tab: {
      value: 0
    },
    form: {
     signIn: {
       email: '',
       password: '',
       rememberMe: false,
       errorMessage: '',
     },
     signUp: {
       email: '',
       password: '',
       passwordConfirm: '',
       errorMessage: '',
     },
    },
    toDashboard: false,
  };

  componentDidMount() {
    authService.isAuthenticated()
      .then(status => {
        if (status) {
          this.setState({toDashboard: true})
        }
      })
      .catch(e => {})
  }

  // Tabs
  handleTabChange = (event, value) => {
    this.setState({ tab: { value } });
  };

  handleTabChangeIndex = index => {
    this.setState({ tab: { value: index } });
  };

  // Form
  handleSignInSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const {signIn} = this.state.form;
    let errMess = '';

    // simple validation
    if (signIn.password.length < 6) {
      errMess = 'Password not valid';
    }

    if (errMess) {
      return this.setState(prevState =>
        _.merge(
          {},
          prevState,
          { form: { signIn: { errorMessage: errMess } } }
        )
      );
    }

    authService.signIn({email: signIn.email, password: signIn.password})
      .then(() => this.setState({toDashboard: true}))
      .catch(e => {
        this.setState(prevState =>
          _.merge(
            {},
            prevState,
            { form: { signIn: { errorMessage: e.message || 'Wrong email or password' } } }
          )
        )
      });
  };

  handleSignUpSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const {signUp} = this.state.form;
    let errMess = '';

    // simple validation
    if (signUp.password.length < 6) {
      errMess = 'Password not valid';
    }

    if (!errMess && signUp.password !== signUp.passwordConfirm) {
      errMess = 'Password and PasswordConfirm not equal';
    }

    if (errMess) {
      return this.setState(prevState =>
        _.merge(
          {},
          prevState,
          { form: { signUp: { errorMessage: errMess } } }
        )
      );
    }

    const data = {
      username: signUp.email,
      ...signUp,
    };

    authService.signUp(data)
      .then(user => {
        this.setState({toDashboard: true});
      })
      .catch(e => {
        return this.setState(prevState =>
          _.merge(
            {},
            prevState,
            { form: { signUp: { errorMessage: 'Something Wrong!' } } }
          )
        );
      });

  };

  handleFormInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // console.log(name,value,);

    const [formName, key] = ( name && name.split('.') ) || [];
    const pathIsValid = formName && (formName in this.state.form) && key && (key in this.state.form[formName]);

    if (pathIsValid) {
      this.setState(prevState => _.merge({}, prevState, { form: { [formName]: { [key]: value } } })
      );
    }
  };

  render() {
    const { classes, theme } = this.props;

    if (this.state.toDashboard) {
      return <Redirect to="/" />
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>


          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.tab.value}
                onChange={this.handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={this.state.tab.value}
              onChangeIndex={this.handleTabChangeIndex}
            >
              <TabContainer dir={theme.direction}>

                <form name="signIn" className={classes.form} onSubmit={this.handleSignInSubmit}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="si-email">Email Address</InputLabel>
                    <Input id="si-email" name="signIn.email" type="email" onChange={this.handleFormInputChange} autoComplete="email" autoFocus />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="si-password">Password</InputLabel>
                    <Input id="si-password" name="signIn.password" type="password" onChange={this.handleFormInputChange} autoComplete="current-password" />
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox name="signIn.rememberMe" value="remember" color="primary" onChange={this.handleFormInputChange} />}
                    label="Remember me"
                  />
                  {
                    this.state.form.signIn.errorMessage
                      ? <div className={'form-error-holder'}>
                          <span>Error: {this.state.form.signIn.errorMessage}</span>
                        </div>
                      : ''
                  }
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign in
                  </Button>
                </form>

              </TabContainer>
              <TabContainer dir={theme.direction}>

                <form name="signUp" className={classes.form} onSubmit={this.handleSignUpSubmit}>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="su-email">Email Address</InputLabel>
                    <Input id="su-email" name="signUp.email" type="email" onChange={this.handleFormInputChange} autoComplete="email" />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="su-password">Password</InputLabel>
                    <Input id="su-password" name="signUp.password" type="password" onChange={this.handleFormInputChange} autoComplete="password" />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="su-password-confirm">Password Confirm</InputLabel>
                    <Input id="su-password-confirm" name="signUp.passwordConfirm" type="password" onChange={this.handleFormInputChange} autoComplete="password-confirm" />
                  </FormControl>
                  {
                    this.state.form.signUp.errorMessage
                      ? <div className={'form-error-holder'}>
                          <span>Error: {this.state.form.signUp.errorMessage}</span>
                        </div>
                      : ''
                  }
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign Up
                  </Button>
                </form>

              </TabContainer>
            </SwipeableViews>
          </div>

        </Paper>
      </main>
  )};
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};



export default withStyles(styles, { withTheme: true })(SignIn);