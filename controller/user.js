const uploads = require("../helper/file")
let { registerUser, loginUser, forgetUser, resetPassword, getMe, updateMe, changePass, addprofile, deactivate, activate, updateProfile, findAll, assignPer, getpermission, getallpermission, update, softDelete, softUndelete, active, unActive } = require("../model/user")
let excel = require("../helper/excel")
let { User } = require("../schema/user")
async function register_me(request, response) {
    let reg = await registerUser(request.body).catch((err) => {
        return { error: err }
    })
    console.log(reg)
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.status(200).send({ data: reg })
}

async function login_me(request, response) {
    let login = await loginUser(request.body).catch((err) => {
        return { error: err }
    })
    if (!login || login.error) {
        return response.status(401).send({ error: login.error })
    }
    return response.send({ data: login })
}

async function forget_me(request, response) {
    let reg = await forgetUser(request.body).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function reset_me(request, response) {
    let reg = await resetPassword(request.body).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function get_me(request, response) {
    let reg = await getMe(request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function update_me(request, response) {
    let reg = await updateMe(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function change_pass(request, response) {
    let change = await changePass(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!change || change.error) {
        return response.status(401).send({ error: change.error })
    }
    return response.send({ data: change })
}

async function add_profile(request, response) {
    let file = await uploads(request, response, "upload_pic", { destination: './user-images/', fileSize: 3 * 3000 * 300 }).catch((err) => {
        return { error: err }
    });
    if (!file || file.error) {
        return response.status(401).send({ error: "internal server error" })
    }
    let reg = await addprofile(file.path, request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function update_profile(request, response) {
    let file = await uploads(request, response, "update_pic", {
        destination: './user-images/',
        fileSize: 3 * 3000 * 300
    }).catch((err) => {
        return { error: err }
    });
    if (!file || file.error) {
        return response.status(401).send({ error: "internal server error" })
    }
    let reg = await updateProfile(file.path, request.userData).catch((err) => {
        return { error: err }
    })
    if (!reg || reg.error) {
        return response.status(401).send({ error: reg.error })
    }
    return response.send({ data: reg })
}

async function deactivate_me(request, response) {
    let change = await deactivate(request.body, request.userData).catch((err) => {
        return { error: err }
    })
    if (!change || change.error) {
        return response.status(401).send({ error: change.error })
    }
    return response.status(200).send({ data: change })
}

async function activate_me(request, response) {
    let change = await activate(request.body).catch((err) => {
        return { error: err }
    })
    if (!change || change.error) {
        return response.status(401).send({ error: change.error })
    }
    return response.status(500).send({ data: change })
}

async function findUser(request, response) {
    let find = await findAll(request.body).catch((err) => {
        return { error: err }
    });
    if (!find || find.error) {
        return response.status(401).send({ error: find.error })
    }
    return response.send({ data: find })
}

async function assignPermission(request, response) {
    let assign = await assignPer(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    console.log(assign)
    if (!assign || assign.error) {
        return response.status(401).send({ error: assign.error })
    }
    return response.send({ data: assign })
}

async function getAllPer(request, response) {
    let all = await getallpermission(request.body).catch((err) => {
        return { error: err }
    })
    console.log(all)
    if (!all || all.error) {
        return response.status(401).send({ error: all.error })
    }
    return response.send({ data: all })
}

async function userPermission(request, response) {
    let per = await getpermission(request.body).catch((err) => {
        return { error: err }
    });
    if (!per || per.error) {
        return response.status(401).send({ error: per.error })
    }
    return response.send({ data: per })
}

async function updateUser(request, response) {
    let up = await update(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    if (!up || up.error) {
        return response.status(401).send({ error: up.error })
    }
    return response.send({ data: up })
}

async function deleteUser(request, response) {
    let deleteU = await softDelete(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    if (!deleteU || deleteU.error) {
        return response.status(401).send({ error: deleteU.error })
    }
    return response.send({ data: deleteU })
}

async function unDeleteUser(request, response) {
    let UndeleteU = await softUndelete(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    if (!UndeleteU || UndeleteU.error) {
        return response.status(401).send({ error: UndeleteU.error })
    }
    return response.send({ data: UndeleteU })
}

async function activeUser(request, response) {
    let act = await active(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    if (!act || act.error) {
        return response.status(401).send({ error: act.error })
    }
    return response.send({ data: act })
}

async function unActiveUser(request, response) {
    let unAct = await unActive(request.body, request.userData).catch((err) => {
        return { error: err }
    });
    if (!unAct || unAct.error) {
        return response.status(401).send({ error: unAct.error })
    }
    return response.send({ data: unAct })
}

// export userss

async function exportUsers(request, response) {
    let find = await User.findAll({ raw: true }).catch((err) => {
        return { error: err }
    })
    if (!find || find.error) {
        return response.status(500).send({ error: "Internal server Error" })
    }
    let columns = [
        { header: 'id', key: 'id', width: 10 },
        { header: 'name', key: 'name', width: 10 },
        { header: 'username', key: 'username', width: 10 },
        { header: 'phone', key: 'phone', width: 10 },
    ]

    let filename = "users";

    await excel(request, response, filename, columns, find).then((data) => {
        return { data: data }
    }).catch((err) => {
        return { error: err }
    })

}
module.exports = {
    register_me,
    login_me,
    update_me,
    change_pass,
    forget_me,
    reset_me,
    get_me,
    add_profile,
    update_profile,
    deactivate_me,
    activate_me,
    findUser,
    assignPermission,
    getAllPer,
    userPermission,
    updateUser,
    deleteUser,
    unDeleteUser,
    activeUser,
    unActiveUser,
    exportUsers
}