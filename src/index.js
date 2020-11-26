// Get all Projects
var projectsPrs = fetch("https://app.paymoapp.com/api/projects/", {
        headers: {
            "X-Session": "5059fe5ba060edfd2e29cf241a40d1fd"
        },
    })
    .then(res => res.json())



// Get all Tasklists
var taskLstPrs = fetch("https://app.paymoapp.com/api/tasklists/", {
        headers: {
            "X-Session": "5059fe5ba060edfd2e29cf241a40d1fd"
        },
    })
    .then(res => res.json())


// Get all Tasks
var tasksPrs = fetch("https://app.paymoapp.com/api/tasks/", {
        headers: {
            "X-Session": "5059fe5ba060edfd2e29cf241a40d1fd"
        },
    })
    .then((res) => res.json())

Promise.all([projectsPrs, taskLstPrs, tasksPrs])
    .then(([prjObj, taskLstObj, taskObj]) => {
        var result = [];
        prjObj.projects.forEach((element) => {
            var tsk_lists = taskLstObj.tasklists
                .filter((taskListElm) => taskListElm.project_id == element.id)
                .map((taskListElm) => {
                    return {
                        name: taskListElm.name,
                        tasks: taskObj.tasks
                            .filter(
                                (taskElm) =>
                                taskElm.project_id == element.id && taskElm.taskLst_id == taskElm.id
                            )
                            .map((ele) => ele.name),
                    };
                });
            let prj = {
                name: element.name,
                taskLst: tsk_lists,
            };
            result.push(prj);
        });
        return Promise.resolve(result);
    })


    .then((res) => {
        var l = document.querySelector("#show");

        res.forEach((project) => {
            var li = document.createElement("li");
            var projTitle = document.createTextNode(project.name);
            li.appendChild(projTitle);

            project.taskLst.forEach((taskLst) => {
                var ulFirst = document.createElement("ul");
                var taskListTitle = document.createTextNode(taskLst.name);
                ulFirst.appendChild(taskListTitle);
                taskLst.tasks.forEach(el => {
                    var ulSecond = document.createElement("ul");
                    var taskTitle = document.createTextNode(el);
                    li.appendChild(taskTitle);
                    ulSecond.appendChild(li);
                    ulFirst.appendChild(ulSecond);
                });
                li.appendChild(ulFirst);
            });
            l.appendChild(li);
        });
    });