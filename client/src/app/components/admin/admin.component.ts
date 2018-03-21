import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SchoolService } from '../../services/adminServices/school.service';
import { TaskService } from '../../services/adminServices/task.service';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  loggedUser: any;
  name: any;
  description: any;
  admin_email: any;
  admin_username: any;
  admin_password: any;
  newTaskOrg: any;
  organizations: any;
  expandOrganizationTask: any;
  messageClass;
  message;
  school: any;
  selectedOrg: {
    name: string,
    description: string,
    admin: any;
    admin_username: string,
    admin_email: string,
    admin_password: string
  };
  taskItem: any;
  selectedTask: any;
  questionnarArray: any[] = [];
  selectedTaskArray: any[] = [];
  selectedOrganization: any;
   // task adding section
  questionTypes: any;
  questionType: any;
  selectedQuestionType: any;
  tasks: any;
  step: string;
  public types = [
    {
      id: 'ITEM_TO_DO',
      name: 'Item to Do'
    },
    {
      id: 'ANSWER_QUESTION',
      name: 'Answer to a question'
    },
    {
      id: 'COMPLETE_QUESTIONNARE',
      name: 'Complete a questionnare'
    }
  ];
  public QuesnnareItemTypes = [
    {
      id: 'QUESTION',
      name: 'Question and Answer'
    },
    {
      id: 'NUMBER',
      name: 'Number Answer'
    },
    {
      id: 'CHECKBOXES',
      name: 'Multiple Choise checkboxes'
    },
    {
      id: 'RADIO',
      name: 'Radio Button Question'
    },
    {
      id: 'BOOLEAN',
      name: 'Boolean Question'
    }
  ];
  questionObj = {
    label: '',
  };
  newTask = {
    label: '',
    deadline: new Date(),
    title: ''
  };

  public questions = [
    {
      possibleBooleans: [{
        is_selected: false
      }],
      possibleAnswersRadio: [{
        is_selected: false
      }],
      possibleAnswers: [{
        is_selected: false
      }]
    }

  ];
  @ViewChild('myModel') myModal;
  constructor(private schoolService: SchoolService, private el: ElementRef, private taskService: TaskService) { }
  
  openModel() {
    this.myModal.nativeElement.className = 'modal fade show';
  }

  fetchSchools(): Promise<any> {
    return this.schoolService.getAllOrganizations().map(response => this.organizations = response.ogranizations)
      .toPromise();
  }

  fetchTasks(): Promise<any> {
    return this.taskService.getAllTasks().map(response => this.tasks = response.tasks)
      .toPromise();
  }

  delayMessageHide() {
    const messageDiv = document.getElementById('messageDiv');
    messageDiv.className = 'row show-hide-message show-message';
    setTimeout(function () {
      messageDiv.className = 'row show-hide-message hide-message fade';
    }, 3000);
  }

  saveSchool() { // add schools
    const school = {
      name: this.name,
      description: this.description,
      admin_email: this.admin_email,
      admin_username: this.admin_username,
      admin_password: this.admin_password
    };

    this.schoolService.postOrganizations(school).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set an error class
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success'; // Set a success class
        this.message = data.message;
        this.organizations.push(data.org);
      }
    });

    this.delayMessageHide();
    document.getElementById('add-school-dismiss').click();
  }

  saveTask(task) { // add tasks 
    this.taskService.postTasks(task).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set an error class
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success'; // Set a success class
        this.message = data.message;
        this.tasks.push(data.task);
      }
    });

    this.delayMessageHide();
    //   document.getElementById('add-school-dismiss').click();
  }

  expandOrganization(organization: any) {
    this.selectedOrg = organization;
    if (this.selectedOrg.admin_username) {
      this.selectedOrg.admin_username = "",
        this.selectedOrg.admin_password = "",
        this.selectedOrg.admin_email = ""
    }
    document.getElementById('openExpandedSchool').click();
  }

  updateSchool(organization: any) { 
  }

  updateTask(organization: any) { 
  }


  expandTask(organization: any, taskItem: any) {
    this.expandOrganizationTask = organization;
    this.selectedTask = taskItem; 
    document.getElementById('openExpandedTask').click();
  }


  addNewTask(organization: any) { 
    this.newTaskOrg = organization;
    document.getElementById('addTaskButton').click();
  }

  addNewGlobalTask() {
    this.newTaskOrg = {};
    document.getElementById('addTaskButton').click();
  }
  addTask(newTaskOrg, questionType, newTask) {
    const task = {
      task_id: this.generateUUID(),
      task_type: questionType,
      title: newTask.title,
      task: {
        label: newTask.label,
        deadline: newTask.deadline || new Date()
      },
      task_identifier: 'global',
      task_ord_id : 'global'

    };
    this.saveTask(task)
    // update Task Using api call  
    document.getElementById('add-task-dismiss').click();
  }
  addTaskWithQuestionnare(newTaskOrg, type, questions, newTask) {
    // view the case - new task.title not come.
    const questionArray = [];
    questions.forEach(question => {
      const item = {
        answers: question.answers,
        label: question.label,
        questionnareType: question.questionnareType
      }
      questionArray.push(item);
    });


    const task = {
      task_id: this.generateUUID(),
      task_type: type,
      title: newTask.title,
      task: {
        taskArray: questionArray,
        deadline: newTask.deadline || new Date()
      },
      task_identifier: 'global',
      task_ord_id : 'global'
    };

    // update Task Using api call 
    this.saveTask(task) 
    document.getElementById('add-task-dismiss').click();
  }
 
  addQuestions(questions) {
    this.questionObj = {
      label: '',
    };
    questions.push({
      possibleBooleans: [{
        is_selected: false
      }],
      possibleAnswersRadio: [{
        is_selected: false
      }],
      possibleAnswers: [{
        is_selected: false
      }]

    });
  }


  addAnswers(possibleAnswers, question) {
    possibleAnswers.push({ is_selected: false });
    question.answers = possibleAnswers;
  }

  addAnswersForRadio(possibleAnswersRadio, question) {
    possibleAnswersRadio.push({ is_selected: false });
    question.answers = possibleAnswersRadio;
  }
  addAnswersForBoolean(possibleBooleans, question) {
    possibleBooleans.push({ is_selected: false });
    question.answers = possibleBooleans;
  }

  clearAll() {
    this.questions = [{
      possibleBooleans: [{
        is_selected: false
      }],
      possibleAnswersRadio: [{
        is_selected: false
      }],
      possibleAnswers: [{
        is_selected: false
      }]
    }];
    this.newTask = {
      label: '',
      deadline: new Date(),
      title:''
    };
  }

  generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  addTasksToOrg(org){
    this.selectedOrganization = org;
    document.getElementById('opentaskSelectionModal').click();
  }

  taskIsExisitsOnArray(orgTasks, newTask){ 
    let trueCount = 0;
    orgTasks.forEach(alreadyInTask => {
      if (alreadyInTask._id === newTask._id) {
        trueCount++;
      }
    });

    if (trueCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  addtasksToOrganization(tasks){
    this.selectedTaskArray = [];


    tasks.forEach(task => {
      if (task.is_selected) {
 

        if (this.selectedOrganization.tasks) {

          if (!this.taskIsExisitsOnArray(this.selectedOrganization.tasks, task)) {
            this.selectedTaskArray.push(task);
            this.selectedOrganization.tasks.push(task);
          } 
        } else {
          this.selectedOrganization.tasks = [];
          this.selectedTaskArray.push(task);
          this.selectedOrganization.tasks.push(task);
        }  
      }
    });

    // update this.selectedOrganization with this.selectedTaskArray
    this.schoolService.updateOrganizations( this.selectedOrganization._id, this.selectedTaskArray ).subscribe(data => {
     /* if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set an error class
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success'; // Set a success class
        this.message = data.message;
        this.tasks.push(data.task);
      }*/
    });

    document.getElementById('add-task-to-school-dismiss').click();
  }

  ngOnInit() {
    this.fetchSchools();
    this.fetchTasks();
    this.questionnarArray = [];
  }

}
