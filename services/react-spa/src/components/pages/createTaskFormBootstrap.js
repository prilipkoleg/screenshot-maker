import React, {Component} from 'react';
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = { form: { link: 'http://', } };
  }

  linkOnChange(e) {
    this.setState({form: { link: e.target.value }});
  }

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const link = this.state.form.link;
    console.log(link);

    fetch(
      'http://localhost:3001/api/screenshot',
      {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({link: link}),
      }
    )
      .then((res) => res.json())
      .then(data => console.log(data))
    ;

    return false;
  }

  render() {
    const onSubmit = this.onSubmit.bind(this);

    return (
      <React.Fragment>

        <h3>Screenshot config</h3>

        <Row>
          <Col md={{ size: 8, offset: 2 }}>

            <div className="form-MakeScreenshot-holder">
              <Form className="form-MakeScreenshot" onSubmit={onSubmit}>
                <FormGroup>
                  <Label for="screenshot-link">Link to page for screenshot</Label>
                  <Input
                    id="screenshot-link"
                    name="screenshot-link"
                    type="text"
                    placeholder="Link to Screenshot"
                    value={this.state.form.link}
                    onChange={this.linkOnChange.bind(this)}
                  />
                </FormGroup>

                <Button type="submit" color="primary">Make screenshot</Button>

              </Form>
            </div>

          </Col>
        </Row>

      </React.Fragment>
    )
  }
}


export default LoginPage;