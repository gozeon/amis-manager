import React, { Component } from 'react'
import { Card, InputGroup, Container, Row, Col, FormControl, Navbar, Nav, Button, Modal, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Moment from 'react-moment'
import logo from './166538.png'
import { IoIosAdd } from "react-icons/io"

class Search extends Component {
    constructor(props) {
        super(props)

        this.state = {
            projectData: [],
            searchName: '',
            isSearching: false,
            newProjectDialogShow: false,
            newProjectName: '',
            newProjectDescription: '',
            newProjectAuthID: '',

        }
    }

    doSearch() {
        const { searchName } = this.state
        const url = new URL(`${process.env.REACT_APP_API_URL}/project`)
        const params = {
            name: searchName,
        }

        url.search = new URLSearchParams(params)

        fetch(url)
            .then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    this.setState({ projectData: result.data, isSearching: false })
                } else {
                    toast(result.message)
                }
            })
            .catch(err => toast(err.message))

    }

    handleCreateProject() {
        const { newProjectName, newProjectDescription, newProjectAuthID } = this.state
        console.log(1)
        if (!newProjectName) {
            toast.warn('请填写正确的project名字')
            return
        }

        if (!newProjectAuthID) {
            toast.warn('请填写正确的project 权限id')
            return
        }

        const url = new URL(`${process.env.REACT_APP_API_URL}/project`)

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newProjectName,
                description: newProjectDescription,
                auth_id: newProjectAuthID
            })
        }).then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    this.setState({ newProjectDialogShow: false }, () => this.doSearch())
                } else {
                    toast.error(result.message)
                }
            })
            .catch(err => toast.error(err.message))

    }

    componentDidMount() {
        this.doSearch()
    }

    search(e) {
        this.setState({ searchName: e.target.value }, () => this.doSearch())
    }

    render() {
        const { projectData, newProjectDialogShow } = this.state

        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                        />
                        {` Axe Mis Square`}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Search</Nav.Link>
                    </Nav>
                </Navbar>

                <Container>
                    <Row className="justify-content-md-center mt-5">
                        <Col className="d-flex">
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Search"
                                    aria-label="Search"
                                    onChange={e => ::this.search(e)}
                                />
                            </InputGroup>

                            <Button variant="outline-secondary" className="form-control ml-2" style={{ width: '3rem' }}
                                    onClick={() => this.setState({ newProjectDialogShow: true })}>
                                <IoIosAdd size={20}/>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex flex-wrap">
                            {projectData.map((project, index) => (
                                <Card key={index} style={{ width: '20rem' }} className="mr-2 mt-2">
                                    <Card.Body>
                                        <Card.Title>{project.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            <Moment format="YYYY/MM/DD HH:mm:ss">{project.create_at}</Moment>
                                        </Card.Subtitle>
                                        <Card.Text>{project.description}</Card.Text>

                                        <Card.Link as={Link} to={`/editor/${project.id}`}>Editor</Card.Link>
                                        <Card.Link as={Link} to={`/workspace/${project.id}`}>Workspace</Card.Link>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                    </Row>
                </Container>


                <Modal show={newProjectDialogShow} onHide={() => this.setState({ newProjectDialogShow: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter project name"
                                          onChange={e => this.setState({ newProjectName: e.target.value })}/>
                        </Form.Group>
                        {/*<Form.Group controlId="formGroupUrl">*/}
                        {/*    <Form.Label>Url</Form.Label>*/}
                        {/*    <Form.Control type="text" placeholder="Enter page url. (e: /axe/name)"*/}
                        {/*                  onChange={e => this.setState({ newProjectDescription: e.target.value })}/>*/}
                        {/*</Form.Group>*/}

                        <Form.Group controlId="formGroupAuthID">
                            <Form.Label>Auth ID</Form.Label>
                            <Form.Control type="text" placeholder="Enter auth id"
                                          onChange={e => this.setState({ newProjectAuthID: e.target.value })}/>
                        </Form.Group>

                        <Form.Group controlId="formGroupDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows="3"
                                          onChange={e => this.setState({ newProjectDescription: e.target.value })}/>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>

                        <Button variant="primary" onClick={::this.handleCreateProject}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer/>
            </div>
        )
    }
}

export default Search
