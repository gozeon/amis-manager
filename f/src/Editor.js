import React from 'react'
import { map, filter } from "lodash"
import MonacoEditor from 'react-monaco-editor'
import stringify from 'fast-stringify'
import './Editor.css'
import { toast } from "react-toastify"
import { Col, Nav, Navbar, Row, Button, Container, Badge, Modal, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import logo from "./166538.png"
import AmisRender from './AmisRender'

class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pageData: '',
            activePageId: '',
            reviewData: {},
            // TODO: 每页数据也可以在每个menus里面，如果权限系统不太好接入，可以node转发一下
            menus: [],
            isSearching: false,
            newPageDialogShow: false,
            newPageName: '',
            newPageUrl: '',
            savePageDialogShow: false,
        }
    }

    menuSelect(menu) {
        const { menus } = this.state
        const newMenus = map(menus, i => {
            if (i.id === menu.id) {
                i._active = true
            } else {
                i._active = false
            }
            return i
        })
        this.setState({
            menus: newMenus,
            pageData: stringify(JSON.parse(menu.data), null, 4),
            reviewData: JSON.parse(menu.data),
            activePageId: menu.id
        })
    }

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor, monaco)

        editor.focus()
    }

    editorChange(newValue, e) {
        let newReviewData
        try {
            newReviewData = JSON.parse(newValue)
        } catch (err) {
            newReviewData = this.state.reviewData
        } finally {
            this.setState({ reviewData: newReviewData, pageData: newValue })
        }
    }

    handleCreatePage() {
        const { params } = this.props.match
        const { newPageName, newPageUrl } = this.state

        if (!newPageName) {
            toast.warn('请填写正确的page名字')
            return
        }
        if (!newPageUrl) {
            toast.warn('请填写正确的page url')
            return
        }

        const url = new URL(`${process.env.REACT_APP_API_URL}/page`)

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newPageName,
                url: newPageUrl,
                data: stringify({
                    "$schema": "https://houtai.baidu.com/v2/schemas/page.json",
                    "type": "page",
                    "body": {
                        "type": "tpl",
                        "tpl": "欢迎使用 Axe Mis Square"
                    }
                }),
                project_id: params.id
            })
        }).then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    this.setState({ newPageDialogShow: false }, () => this.doGetPages())
                } else {
                    toast.error(result.message)
                }
            })
            .catch(err => toast.error(err.message))

    }

    handleSavePage() {
        const { menus, reviewData, activePageId } = this.state
        const activeMenu = filter(menus, i => i._active)[0]

        const url = new URL(`${process.env.REACT_APP_API_URL}/page`)
        console.log(activePageId)
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: stringify(Object.assign({}, activeMenu, { data: stringify(reviewData) }))
        }).then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(activePageId)
                    toast.success(`${activeMenu.name} 保存成功`)
                    this.doGetPages()
                } else {
                    toast.error(result.message)
                }
            })
            .catch(err => toast.error(err.message))
    }

    componentWillMount() {
    }

    doGetPages() {
        const { params } = this.props.match
        const { activePageId } = this.state
        const url = new URL(`${process.env.REACT_APP_API_URL}/page`)
        const _params = {
            projectId: params.id,
        }

        url.search = new URLSearchParams(_params)

        fetch(url)
            .then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    let defaultPageDate = '{}'
                    const first = result.data[0]

                    if (first) {
                        if (activePageId) {
                            const d = filter(result.data, item => item.id === activePageId)[0].data
                            defaultPageDate = stringify(JSON.parse(d), null, 4)
                        } else {
                            defaultPageDate = stringify(JSON.parse(first.data), null, 4)
                        }
                    }

                    this.setState({
                        isSearching: false,
                        projectData: result.data,
                        pageData: defaultPageDate,
                        reviewData: JSON.parse(defaultPageDate),
                        menus: map(result.data, (item, index) => {
                            if (activePageId) {
                                item.id === activePageId ? item._active = true : item._active = false
                            } else {
                                index === 0 ? item._active = true : item._active = false
                            }

                            return item
                        }),
                    })
                } else {
                    toast(result.message)
                }
            })
            .catch(err => toast(err.message))

    }

    componentDidMount() {
        this.doGetPages()
    }

    componentWillUnmount() {

    }

    render() {
        const {match}= this.props
        const { pageData, menus, newPageDialogShow, reviewData, savePageDialogShow } = this.state
        const options = {
            selectOnLineNumbers: true,
        }

        return (
            <div className="App">
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
                        <Nav.Link as={Link} to={`/workspace/${match.params.id}`}>Workspace</Nav.Link>
                    </Nav>

                </Navbar>

                <Container fluid>
                    <Row className="d-flex flex-wrap">
                        <Col md={2} className="common-height">
                            <Row>
                                <Col className="flex-column mt-2 mb-2">
                                    <Button variant="outline-secondary" size="sm" block
                                            onClick={() => this.setState({ newPageDialogShow: true })}>
                                        New Page
                                        {/*<IoIosAdd size={20} />*/}
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" block onClick={::this.handleSavePage}>
                                        Save
                                        {/*<IoMdSave size={20} />*/}
                                    </Button>
                                </Col>
                            </Row>

                            <Nav className="flex-column nav-pills">
                                {menus.map((menu, index) => (
                                    <Nav.Item key={index} style={{ cursor: 'pointer' }}
                                              onClick={() => ::this.menuSelect(menu)}>
                                        <Nav.Link active={menu._active} disabled>
                                            {menu.name}
                                            <Badge variant="warning" className="float-right mt-1">{menu.url}</Badge>
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Col>

                        {menus.length ? (
                            <>
                                <Col md={5} className="common-height">
                                    <MonacoEditor
                                        language="json"
                                        theme="vs"
                                        value={pageData}
                                        options={options}
                                        onChange={::this.editorChange}
                                        editorDidMount={::this.editorDidMount}
                                    />
                                </Col>

                                <Col md={5} className="common-height">
                                    <AmisRender data={reviewData}/>
                                </Col>
                            </>
                        ) : <></>}


                    </Row>
                </Container>


                <Modal show={newPageDialogShow} onHide={() => this.setState({ newPageDialogShow: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Page</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter page name"
                                          onChange={e => this.setState({ newPageName: e.target.value })}/>
                        </Form.Group>
                        <Form.Group controlId="formGroupUrl">
                            <Form.Label>Url</Form.Label>
                            <Form.Control type="text" placeholder="Enter page url. (e: /axe/name)"
                                          onChange={e => this.setState({ newPageUrl: e.target.value })}/>
                        </Form.Group>
                        {/*<Form.Group controlId="formGroupTemplate">*/}
                        {/*    <Form.Label>Choose a Template</Form.Label>*/}
                        {/*    <Form.Control as="select">*/}
                        {/*        <option>1</option>*/}
                        {/*        <option>2</option>*/}
                        {/*        <option>3</option>*/}
                        {/*        <option>4</option>*/}
                        {/*        <option>5</option>*/}
                        {/*    </Form.Control>*/}
                        {/*</Form.Group>*/}
                    </Modal.Body>
                    <Modal.Footer>
                        {/*<Button variant="secondary" onClick={handleClose}>*/}
                        {/*    Close*/}
                        {/*</Button>*/}
                        <Button variant="primary" onClick={::this.handleCreatePage}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={savePageDialogShow} onHide={() => this.setState({ savePageDialogShow: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={::this.handleSavePage}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Editor
