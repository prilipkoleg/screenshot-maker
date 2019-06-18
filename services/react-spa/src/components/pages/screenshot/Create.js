import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Switch,
  Button,
  LinearProgress,
} from "@material-ui/core";

import DashboardLayout from '../../layouts/Dashboard/';
import * as chunk from '../chunks';

import { mainApi } from '../../../services';

function DashboardPage() {
  const components = {
    HeaderContent: chunk.HeaderContent,
    NavContent: chunk.NavContent,
    PageContent: getPageContent(),
    FooterContent: chunk.FooterContent,
  };

  return DashboardLayout(components)
}

export default DashboardPage;

const ColorLinearProgress = withStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  colorPrimary: {
    backgroundColor: theme.palette.secondary,
  },
  barColorPrimary: {
    backgroundColor: theme.palette.primary,
  },
}))(LinearProgress);

function getPageContent() {
  const styles = (theme) => ({
    root: {
      marginTop: theme.spacing(2),
    },
    formMakeScreenshot: {
      paddingTop: theme.spacing(2)
    },
    formInput: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },

  });

  return withStyles(styles)(({ classes }) => {

    const defaultState = {
      'scr-link': '',
      'scr-fullPage': false,
      'scr-width': 1920,
      'scr-height': 1024,
      'scr-timeout': 0,
      onSubmitting: false,
    };

    const [values, setValues] = React.useState(defaultState);

    const handleChange = name => (event, value) => {
      const val =
        value !== undefined
          ? value
          : event.target.value;
      console.log(name, val, event.target.value,  value);
      setValues({ ...values, [name]: val });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log(values);

      const data = {
        link: values["scr-link"],
        options: {
          fullPage: values["scr-fullPage"],
          width: values["scr-width"],
          height: values["scr-height"],
          timeout: values["scr-timeout"],
        },
      };

      setValues({ ...values, onSubmitting: true});

      const startTime = Date.now();

      mainApi.screenshotCreate(data)
        .then(() => {
          if ((Date.now() - startTime) < 1000) {
            return setTimeout(() => setValues(defaultState), 1000);
          }
          setValues(defaultState);
        })
        .catch(e => {
          setValues({...values, onSubmitting: false});
          alert('FAIL')
        });
    };

    return (

        <div className={classes.root}>
          <Container maxWidth="md">

            <Typography variant={"h5"}>Create Sreenshot</Typography>

            <Divider />

            <form
              name={'make-screenshot'}
              className={classes.container}
              // noValidate
              // autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                id="scr-link"
                name="scr-link"
                className={classes.formInput}
                variant="outlined"
                label="WEB page link"
                value={values['scr-link']}
                onChange={handleChange('scr-link')}
                helperText="Web page for screenshot"
                fullWidth
                required
              />
              <FormGroup row>
                <FormControlLabel
                  // value={true}
                  value={!values['scr-fullPage']}
                  control={
                    <Switch
                      name="scr-fullPage"
                      // value={!values['scr-fullPage']}
                      color="primary"
                      onChange={handleChange('scr-fullPage')}
                    />}
                  label="Full page"
                  labelPlacement="start"
                />
                <TextField
                  id="scr-width"
                  name="scr-width"
                  variant="outlined"
                  disabled={!!values["scr-fullPage"]}
                  className={classes.formInput}
                  label="Width"
                  value={values['scr-width']}
                  onChange={handleChange('scr-width')}
                  helperText="Screenshot width"
                  type="Number"
                  InputProps={{
                    min: 100,
                    max: 3000,
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
                <TextField
                  id="scr-height"
                  name="scr-height"
                  variant="outlined"
                  disabled={!!values["scr-fullPage"]}
                  className={classes.formInput}
                  label="Height"
                  value={values['scr-height']}
                  onChange={handleChange('scr-height')}
                  helperText="Screenshot height"
                  type="Number"
                  InputProps={{
                    min: 100,
                    max: 3000,
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </FormGroup>
              <TextField
                id="scr-timeout"
                name="scr-timeout"
                variant="outlined"
                label="Timeout"
                className={classes.formInput}
                value={values['scr-timeout']}
                onChange={handleChange('scr-timeout')}
                helperText="Timeout between page loading and screenshot creating"
                type="Number"
                InputProps={{
                  min: 0,
                  max: 60,
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
              />
              <Divider />
              {
                values.onSubmitting
                 ? <ColorLinearProgress />
                 :  <Button
                      variant="contained"
                      color="primary"
                      className={classes.formInput}
                      type={"submit"}
                      fullWidth
                    >
                      Create
                    </Button>
              }
            </form>

          </Container>
        </div>

    );
  });
}
