import React from 'react';
import { withStyles } from "@material-ui/core/styles";
// import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import WarningIcon from '@material-ui/icons/Warning';

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  CircularProgress,
} from "@material-ui/core";

import DashboardLayout from '../../layouts/Dashboard/';
import * as chunk from '../chunks';

import { mainApi } from '../../../services';

import config from '../../../config';

function DashboardPage() {
  const components = {
    HeaderContent: chunk.HeaderContent,
    NavContent: chunk.NavContent,
    PageContent: screenshotsList,
    FooterContent: chunk.FooterContent,
  };

  return DashboardLayout(components)
}

export default DashboardPage;


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

});

class ScreenshotsListRoot extends React.Component {
  state = {
    screenshots: [],
    expanded: false,
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    this.getScreenshots();
  }

  handleChange = panel => (event, isExpanded) => {
    this.setState({
      expanded: isExpanded ? panel : false,
    });
  };

  getScreenshots() {
    mainApi.screenshotsList()
      .then((screenshots = []) => this.setState({screenshots}))
      .catch(e => e);
  }

  handleScreenshotRecreate = screenshotId => (event) => {
    mainApi.screenshotReCreate(screenshotId)
      .then(() => this.getScreenshots())
      .catch(e => alert(e));
  };

  handleScreenshotDelete = screenshotId => (event) => {
    mainApi.screenshotDelete(screenshotId)
      .then(() => this.getScreenshots())
      .catch(e => alert(e));
  };

  render() {
    const classes = this.props.classes;
    const {screenshots, expanded} = this.state;

    return (
      <Container maxWidth="lg" className={classes.root}>
        {
          !screenshots.length
            ? <span>...Empty</span>
            : screenshots
                .map((data, index) => {
                  const { _id: id, } = data;

                  return (
                    <ScreenshotListItemPanel
                      data={data}
                      index={index}
                      key={index}
                      expanded={expanded}
                      handleChange={this.handleChange(id)}
                      deleteHandler={this.handleScreenshotDelete(id)}
                    />
                  )
                })
        }
      </Container>
    )
  }
}

class ScreenshotItemPanel extends React.Component {
  state = {
    data: null,
    onUpdate: false,
  };

  constructor(props) {
    super(props);

    this.state.data = this.props.data;
    this.state.onUpdate = false;
  }

  // handleChange = panel => (event, isExpanded) => {
  //   this.setState({
  //     expanded: isExpanded ? panel : false,
  //   });
  // };

  handleScreenshotRecreate = screenshotId => (event) => {
    mainApi.screenshotReCreate(screenshotId)
      .then(() => this.startUpdateInterval())
      .catch(e => alert(e));
  };

  updateData = () => {
    const id = this.state.data && this.state.data._id;
    id && mainApi.screenshotGet(id)
      .then(data => {
        this.setState({data});

        if (this.state.onUpdate && data.task.status !== 'inWorker') {
          this.stopUpdateInterval();
        }
      })
      .catch(e => {})
  };

  startUpdateInterval() {
    this.setState({onUpdate: true});
    this.interval = setInterval(this.updateData, 1000);
  }

  stopUpdateInterval() {
    this.setState({onUpdate: false});
    clearInterval(this.interval);
  }

  componentWillUnmount() {
    this.stopUpdateInterval();
  }

  componentDidMount() {
    if (this.state.data.task.status === 'inWorker') {
      this.startUpdateInterval();
    }
  }

  render() {
    const {data, onUpdate} = this.state;

    if (!data) return null;

    const classes = this.props.classes;
    const index = this.props.index;
    const expanded = this.props.expanded;

    const { _id: id, createdAt, link, options, storagePath, task } = data;
    const createdAtFormatted = new Date(createdAt).toUTCString();
    const imageSrc = `${config.urls.static}${config.screenshotsBucketName}/${storagePath}?time=${Date.now()}`;
    const isError = task.status === 'error';

    const tableData = {
      Id: id,
      Link: <a href={link} target='_blank' rel="noopener noreferrer">{link.length > 40 ? link.slice(0, 40) + '...' : link }</a>,
      Status: task.status,
      // FullPage: toString(options.fullPage),
      FullPage: options.fullPage.toString(),
      Timeout: `${options.timeout}s`,
      'CreatedAt': createdAtFormatted,
    };

    return (
      <ExpansionPanel
        style={ isError ? {backgroundColor: 'rgba(241,153,151,0.69)'} : {}}
        // expanded={expanded ? expanded === id : index === 0}
        expanded={expanded === id}
        key={id}
        onChange={this.props.handleChange}
      >
        <ExpansionPanelSummary
          className={classes.expansionPanelSummary}
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${id}-content`}
          id={`panel-${id}-content`}
        >
          <Typography className={classes.heading}>{`#${index+1}`}:</Typography>
          <Typography className={classes.secondaryHeading}>{link}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>

          <Grid container justify="center" alignItems="center" spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                component="div"
                display={{ xs: 'block', sm: 'block', md: 'block' }}
                // p={1}
                m={1}
                maxWidth={'100%'}
                maxHeight={250}
                boxShadow={2}
                style={{overflow: "scroll"}}
              >
                {
                  onUpdate || task.status === 'inWorker'
                    ? <div className={classes.progress}><CircularProgress color="secondary" /></div>
                    : isError
                        ? <div className={classes.progress}><WarningIcon/></div>
                        : <a href={imageSrc} target='_blank'  rel="noopener noreferrer" >
                            <img src={imageSrc} alt={link} />
                          </a>
                }
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper className={classes.root}>
                <Table className={classes.table} size={"small"}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Property name</StyledTableCell>
                      <StyledTableCell align="right">Value</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      Object.entries(tableData).map(([key, val]) => (
                          <StyledTableRow key={key}>
                            <StyledTableCell component="th" scope="row">
                              {key}
                            </StyledTableCell>
                            <StyledTableCell align="right">{val}</StyledTableCell>
                          </StyledTableRow>
                        )
                      )
                    }
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>

        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions >
          <Button
            size={'small'}
            variant="contained"
            color="primary"
            className={classes.button}
            // disabled={isError}
            onClick={this.handleScreenshotRecreate(id)}
          >
            <AutorenewIcon/>
            Recreate
          </Button>
          <Button
            size={'small'}
            variant="contained"
            color="secondary"
            className={classes.button}
            // disabled={isError}
            onClick={this.props.deleteHandler}
          >
            <DeleteIcon />
            Delete
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }

}

const StyledTableCell = withStyles(theme => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);
const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function ScreenshotListItemPanel(props) {
  const styles = theme => ({
    heading: {
      fontSize: theme.typography.pxToRem(14),
      marginRight: '10px',
      // flexBasis: '20%',
      // flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(13),
      color: theme.palette.text.secondary,
    },
    expansionPanelSummary: {
      '&.Mui-expanded': {
        borderBottom: `1px solid ${theme.palette.primary.light}`,
      }
    },
    descriptionList: {},
    progress: {
      padding: theme.spacing(10),
      width: '100%',
      textAlign: 'center',
    },
  });

  const Component = withStyles(styles)(({ classes }) => (
    <ScreenshotItemPanel classes={classes} {...props} />
  ));

  return <Component/>
}

function screenshotsList() {
  const Component = withStyles(styles)(({ classes }) => (
    <ScreenshotsListRoot classes={classes} />
  ));

  return <Component />;
}