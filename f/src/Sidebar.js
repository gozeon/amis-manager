import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import './Sidebar.css'
import { IconButton, Pane, Tooltip, Dialog, TextInputField, toaster } from "evergreen-ui"


class Sidebar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isNewShown: false,
            isLoading: false
        }
    }

    handleNew(e) {
        toaster.notify("新建")
    }
    handleSave(e) {
        console.log(e)
        toaster.notify("保存")
    }

    render() {
        return (
            <div className="sidebar-box">
                <Pane padding={5} display="flex" justifyContent="flex-end">
                    <Tooltip content="新建">
                        <IconButton appearance="minimal" icon="plus" iconSize={18}
                                    onClick={() => this.setState({ isNewShown: true })}/>
                    </Tooltip>
                    <Tooltip content="保存">
                        <IconButton appearance="minimal" icon="saved" iconSize={18} onClick={()=> ::this.handleSave()}/>
                    </Tooltip>
                </Pane>

                <nav>
                    {this.props.menus.map(i => (
                        <li key={i._id}
                            className={classNames({ active: i._active })}
                            onClick={() => this.props.handleActive(i)}
                        >
                            {i.name}
                            <small>{i.url}</small>
                        </li>
                    ))}
                </nav>

                <Dialog
                    isShown={this.state.isNewShown}
                    title="新建页面"
                    hasCancel={false}
                    isConfirmLoading={this.state.isLoading}
                    onConfirm={e => ::this.handleNew(e)}
                    confirmLabel={this.state.isLoading ? 'Loading' : '新建'}
                >
                    <TextInputField
                        label="页面名字"
                        description="左侧菜单栏显示的名字"
                        placeholder="学生信息"
                        required
                    />
                    <TextInputField
                        label="页面URL"
                        description="使用相对路径"
                        placeholder="/student/list"
                        required
                    />
                </Dialog>
            </div>
        )
    }
}

Sidebar.propTypes = {
    menus: PropTypes.array.isRequired,
    handleActive: PropTypes.func
}

export default Sidebar