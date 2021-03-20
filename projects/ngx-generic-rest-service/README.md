# Ngx-generic-rest-service &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/juanmesa2097/ngx-generic-rest-service/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/juanmesa2097/ngx-generic-rest-service/blob/main/CONTRIBUTING.md)

**Ngx-generic-rest-service** is a lightweight, strongly typed & very easy-to-use Angular library that handles common HTTP requests to decrease boilerplate when you write common HTTP services. Its main focus is to apply the DRY (Don't repeat yourself) principle.

## Installation

```consola
npm install ngx-grs
```

or

```consola
yarn add ngx-grs
```

## Usage

1. Create your Angular service (e.g., tasksService):

   ```consola
   ng generate service tasks
   ```

2. Extend your Angular service from `NgxGenericRestService`:
   ```ts
   @Injectable({ providedIn: "root" })
   export class TasksService extends NgxGenericRestService {}
   ```
3. Call the constructor of the `NgxGenericRestService` class and pass-in the `baseUrl` and `resourceName`:
   ```ts
   @Injectable({ providedIn: "root" })
   export class TasksService extends NgxGenericRestService {
     constructor() {
       super({
         baseUrl: "https://example.com/api", // environment.apiUrl
         resourceName: "tasks", // API controller
       });
       // endpoint: https://example.com/api/tasks
     }
   }
   ```
   That's it! You can now use your tasks service to perform all kind of HTTP requests

## Perform HTTP request

> Let's assume you have a `tasks-list` smart component:

The first thing you need to do is to inject your `TasksService`:

```ts
@Component({
  templateUrl: "./tasks-list.page.html",
  styleUrls: ["./tasks-list.scss"],
})
export class TasksListPage implements OnInit {
  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {}
}
```

You can now perform HTTP requests inside this component:

```ts
// Model
export interface Task {
  id: number;
  name: string;
  done: boolean;
}
```

- Get a list of tasks

  ```ts
  tasks: Task[];

  fetchTasks(): void {
    this.tasksService.list<Task[]>().subscribe(tasks => this.tasks = tasks);
  }
  ```

- Get a single task

  ```ts
  task: Task;

  fetchTask(taskId: number): void {
    this.tasksService.single<Task>(taskId).subscribe(task => this.task = task);
  }
  ```

- Create a task
  ```ts
  createTask(task: Task): void {
    this.tasksService.add<Task>(task).subscribe();
  }
  ```
- Update a task with a PUT request
  ```ts
  updateTask(taskId: number, task: Partial<Task>): void {
    this.tasksService.update<Task>(taskId, task).subscribe();
  }
  ```
- Update a task with a PATCH request
  ```ts
  updateTask(taskId: number, task: Partial<Task>): void {
    this.tasksService
  	.update<Task>(taskId, task, {
  	  method: 'PATCH'
  	})
  	.subscribe();
  }
  ```
- Delete a task
  ```ts
  deleteTasks(taskId: number): void {
    this.tasksService.delete<Task>(taskId).subscribe();
  }
  ```

## Default HttpClient request options

| Option          | Description                                                                    | Used by                           |
| --------------- | ------------------------------------------------------------------------------ | --------------------------------- |
| headers         | Headers to be attached to a Request                                            | List, Single, Add, Update, Delete |
| params          | Query parameters to be included in a Request.                                  | List, Single, Add, Update, Delete |
| observe         | Determines the return type, according to what you are interested in observing. | List, Single, Add, Update, Delete |
| reportProgress  | Whether this request should be made in a way that exposes progress events.     | List, Single, Add, Update, Delete |
| responseType    | The expected response type of the server.                                      | List, Single, Add, Update, Delete |
| withCredentials | Whether this request should be sent with outgoing credentials (cookies).       | List, Single, Add, Update, Delete |

## Custom HTTP options

| Option     | Description                                                                        | Used by                           |
| ---------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| urlRewrite | Rewrites the entire request API URL                                                | List, Single, Add, Update, Delete |
| urlPostfix | Adds a postfix to the API URL (useful to specify sub-resources)                    | List, Single, Add, Update, Delete |
| method     | Helps the service to understand if it is a PUT or a PATCH request (PUT by default) | Update                            |
| mapFn      | Transforms the API response to the desired output                                  | List, Single, Add, Update, Delete |
