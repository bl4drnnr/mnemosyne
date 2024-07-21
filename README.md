<h1 align="center">
    MNEMOSYNE
</h1>

# Table of Contents

1. [Introduction](#introduction)
2. [Existing Solutions](#existing-solutions)
3. [Infrastructure](#infrastructure)
4. [Technology Stack](#technology-stack)
    1. [Programming Languages and Platform](#programming-languages-and-platform)
    2. [Front-end Framework](#front-end-framework)
    3. [Back-end Framework](#back-end-framework)
    4. [Databases](#databases)
    5. [Cloud Technologies](#cloud-technologies)
    6. [Containerization](#containerization)
5. [Front-end](#front-end)
    1. [Components](#components)
    2. [Pages and Navigation](#pages-and-navigation)
    3. [Communication with Back-end](#communication-with-back-end)
    4. [Localization](#localization)
6. [Back-end](#back-end)
    1. [Modules](#modules)
    2. [DTO](#dto)
    3. [Middleware](#middleware)
    4. [Guards](#guards)
    5. [Decorators](#decorators)
7. [Databases Technologies](#databases-technologies)
    1. [ORM](#orm)
    2. [Database Models](#database-models)
    3. [Transactions and Databases Interceptors](#transactions-and-databases-interceptors)
8. [Concepts of Security Measures](#concepts-of-security-measures)
    1. [Authentication](#authentication)
    2. [Authorization](#authorization)
    3. [Account Recovery Keys](#account-recovery-keys)
    4. [Logs](#logs)
    5. [User Input Data Validation](#user-input-data-validation)
    6. [Error Handling](#error-handling)
9. [Implementation of security measures](#implementation-of-security-measures)
    1. [Security Measures on Front-end](#security-measures-on-front-end)
        1. [Validation of User Input on Front-end](#validation-of-user-input-on-front-end)
        2. [User Authentication on Front-end](#user-authentication-on-front-end)
        3. [Multi-Factor Authentication on Front-end](#multi-factor-authentication-on-front-end)
        4. [Account Recovery Keys on Front-end](#account-recovery-keys-on-front-end)
        5. [Error Handling on Front-end](#error-handling-on-front-end)
    2. [Security Measures on Back-end](#security-measures-on-back-end)
        1. [Validation of User Input on Back-end](#validation-of-user-input-on-back-end)
        2. [User Authentication on Back-end](#user-authentication-on-back-end)
        3. [Multi-Factor Authentication on Back-end](#multi-factor-authentication-on-back-end)
        4. [Account Recovery Keys on Back-end](#account-recovery-keys-on-back-end)
        5. [Error Handling on Back-end](#error-handling-on-back-end)
        6. [User Access on Back-end](#user-access-on-back-end)
    3. [Proxy Server](#proxy-server)
        1. [Protection of Cookies](#protection-of-cookies)
        2. [Authentication of API](#authentication-of-api)
        3. [Saving Logs](#saving-logs)
        4. [Error Handling on Proxy Server](#error-handling-on-proxy-server)
    4. [Implementation of Security Measures for Intrastructure](#implementation-of-security-measures-for-intrastructure)
        1. [AWS IAM](#aws-iam)
        2. [AWS S3](#aws-s3)
        3. [AWS EC2](#aws-ec2)
        4. [AWS RDS](#aws-rds)
        5. [Nginx Web Server and TLS/SSL](#nginx-web-server-and-tlsssl)
        6. [DNS and e-mail infrastructure](#dns-and-e-mail-infrastructure)
10. [Application Deployment](#application-deployment)
    1. [Version Control System](#version-control-system)
    2. [CI/CD](#cicd)
    3. [GitHub Actions](#github-actions)
11. [Tests of Application](#tests-of-application)
    1. [Unit and integration testing using Jest](#unit-and-integration-testing-using-jest)
    2. [Automatic testing during application deployment](#automatic-testing-during-application-deployment)
12. [Documentation](#documentation)
    1. [OpenAPI](#openapi)
    2. [Swagger](#swagger)
    3. [Views of Application](#views-of-application)
13. [Last Word](#last-word)
14. [Annexes](#annexes)

# Introduction

In the dynamic landscape of modern commerce, the proliferation of online marketplaces heralds a paradigm shift in the way goods and services are exchanged in the digital sphere. As technological advances continue to transform the global marketplace, traditional trading models are increasingly giving way to innovative online platforms that offer unparalleled convenience, accessibility and efficiency. The development of online marketplaces represents a fundamental shift from traditional retailing, democratizing access to markets and providing both consumers and sellers with new opportunities to engage and trade. Unlike traditional retail channels, which are often limited by geographic restrictions and physical infrastructure, online marketplaces overcome such barriers by providing a virtual marketplace where buyers and sellers from around the world can easily connect and transact. 

The main goal of this project is to harness the transformative potential of the online marketplace by implementing a dynamic platform that facilitates the seamless exchange of goods and services in the digital sphere. Leveraging technological innovations and best practices in e-commerce, the goal of this work is to create a marketplace platform that would allow both businesses and end-users to sell and purchase a variety of goods and services, enabling users to enhance trading opportunities and redefine the parameters of engagement in today's market landscape.

# Existing Solutions

There are already a multitude of solutions on the market, each offering unique features and functionality tailored to the diverse needs of consumers and sellers. One such prominent example is Amazon, which is one of the largest online marketplaces and has revolutionized the way people shop online. With its premier product catalog, intuitive user interface, and efficient fulfillment infrastructure, Amazon has set the benchmark for online marketplaces, facilitating millions of transactions daily across countless product categories. From electronics and clothing to home goods and digital services, the Amazon marketplace ecosystem offers unparalleled convenience and choice to consumers around the world. It is also worth noting that Amazon also works as a SaaS service, as it allows companies to save time, money and resources to create their own website and all the necessary infrastructure to move or expand their business to the online sphere. (Fig. 1)

| ![Picture1.png](static/Picture1.png) | 
|:--:| 
| *Fig. 1. Amazon. Source: https://amazon.com* |

A solution similar to Amazon is eBay. eBay is a testament to the power of peer-to-peer commerce, allowing individuals to buy and sell a wide range of products in an auction format. Through its seller tools, payment mechanisms and buyer protection policies, eBay has developed a thriving community of sellers and buyers, supporting a marketplace where unique and niche items find eager buyers. Additionally, the integration of eBay's advanced search algorithms and recommendation engine provides users with the ability to discover relevant offers tailored to their preferences, improving the overall shopping experience (Fig. 2).

| ![Picture2.png](static/Picture2.png) | 
|:--:| 
| *Fig. 2. eBay. Source: https://ebay.com* |

While Amazon and Ebay are global marketplaces, there are also solutions targeting local, location-based markets. A perfect example of such a local market is olx.pl. At its core, OLX inherits the philosophy of the marketplaces mentioned above, being a place for buyers and sellers, both end users and companies, to communicate. Unlike Amazon and eBay, OLX cannot boast of such a large number of products due to geographical restrictions, as well as a large number of product and service categories. However, its advantage is a much less busy and nicer interface (Fig. 3).

| ![Picture3.png](static/Picture3.png) | 
|:--:| 
| *Fig. 3. OLX. Source: https://olx.pl* |

In their business models, all 3 makretplaces presented above provide the same business solution for end-users and companies - they provide a platform that is used to buy and sell goods and services. The difference between them lies in the geographical markets in which they operate (eBay and Amazon operate globally, while olx.pl provides its services only in Poland), as well as in product categories and the approach to product search. Talking about the goals of this work, the goal is to implement a business model that is used on all 3 platforms, namely to create a platform for the purchase and sale of various goods and services available to both end-users and companies.

# Infrastructure

When talking about application implementation, first of all, you should start with the architecture of all systems, as well as the interactions with each other. The architecture stage involves designing the overall structure and organization of the application, including key decisions about the technology stack, data modeling, system components, and overall system behavior. The entire infrastructure, its key components and components used are shown in the diagram below (Fig. 4).

| ![Picture4.png](static/Picture4.png) | 
|:--:| 
| *Fig. 4. Infrastructure of all elements in the application. Source: own work* |

The entire application will run on AWS virtual infrastructure. The application will consist of three separate subsystems that run on three separate virtual machines - the client part, the proxy server, and the server part. All of this will run using AWS EC2 remote computing resources (virtual computers). AWS S3 will be used to store static data such as icons and images. The AWS RDS service and a database based on the PostgreSQL engine will be used as the main database. Each of the resources in the AWS ecosystem will use special resources to ensure its own security - security groups, and they will all be connected into a special AWS VPC network - a virtual private cloud that allows you to simulate the behavior if these servers were directly connected to each other in this the network itself.

As additional elements of the entire infrastructure, the MongoDB database will also be used to save and store all logs from the server and Cloudflare, which will be used to create a DNS infrastructure to manage the domain name, provide an additional level of security, as well as to create an e-mail system.

# Technology Stack

Choosing the right set of technologies is one of the most important elements of creating a web application, which is discussed at the design stage. The right choice of technology stack, dictated by the current market situation, will have the greatest impact on how its development will proceed, what programming teams will have to be involved in the development of this application, and how stable and secure the application will be.

## Programming Languages and Platform

The main programming language of the entire project will be JavaScript, or more precisely, its add-on providing access to strictly typed data - TypeScript. This programming language is used to create both front-end and back-end. Using TypeScript in both front-end and back-end development offers several benefits that contribute to a more reliable and maintainable project:

1. One of the main advantages of TypeScript is static typing. Allows developers to define variable types, function parameters, and return types. This helps catch type errors at compile time rather than run time, leading to more robust and maintainable code.
2. Static typing helps identify and fix errors early in the development process, leading to improved code quality. This greatly reduces the likelihood of runtime errors caused by type mismatches.
3. TypeScript is perfect for large-scale applications. The ability to define and enforce types helps manage the complexity of large code bases, reducing the risk of errors and making it easier to scale applications.
4. TypeScript has a rich ecosystem of tools and libraries that work well with it. This includes popular build tools, test frameworks, and other development tools that use the TypeScript type system to streamline development workflows.

Initially, JavaScript was only used to create dynamic pages on the client side and was in no way intended to work on the server side, however, it can be noted that in this project this programming language is used not only on the client side of the page, but also on the side server. To achieve this goal, a technology called NodeJS is used - it is an open-source runtime environment that allows JavaScript code to be run on the server. This means that it is possible to use the same programming language on both the client and server sides of web applications. This can simplify programming and improve code sharing between two environments.

## Front-end Framework

Front–end refers to the client side of a web application, which is the part of the application that users interact with directly. It covers everything that users experience visually and interactively in their web browsers. Writing the client part involves creating and implementing the user interface (UI) and user experience (UX) of a website or web application.

In order to simplify the creation of the client part by the programmer, various frameworks are used which, by using a high level of abstraction and providing the programmer with only a specific set of rules for creating a web application, can significantly speed up the creation of the process application and significantly reduce the number of errors when writing it. To create the client part of this project, a framework called Angular was chosen.

Angular is a framework developed by Google. It offers a robust and comprehensive front-end development platform that excels in building dynamic and scalable web applications. Its modular architecture makes code organization and maintenance easier, increasing productivity.

## Back-end Framework

The back-end (or API - Application Programming Interface), which is the server part of the entire application, is responsible for processing requests from the user and sending responses to the client part. The back-end is also responsible for the entire business logic of the application.

The back-end interface itself was designed based on the REST architecture - REST (Representational State Transfer) is an architectural approach used to design web applications and Internet services. It promotes the use of a stateless client-server communication model, in which each request from the client to the server must contain all the information needed to understand and process it. REST also relies on a uniform and consistent interface, typically using standard HTTP methods such as GET, POST, PUT, and DELETE to interact with resources. This approach simplifies communication and increases the scalability and maintainability of web-based systems.

REST works based on the so-called resources (or endpoint). Resources are the underlying abstractions that an API exposes and manipulates. These resources can represent a wide range of things, including data objects, services, or concepts, and are identified by a unique Uniform Resource Identifier (URI), usually a URL. Resources are combined into logical connections using the so-called controllers. This is a specialized class responsible for managing the processing of incoming HTTP requests in the application.
For example, a controller called auth. As the name of this controller suggests, it is responsible for all user authentication operations. Below is a list of some of the resources found in this controller along with their HTTP methods and a short description:

1. `POST /auth/registration` – responsible for creating a new account for the user.
2. `POST /auth/login` – responsible for user authentication.
3. `GET /auth/refresh` – responsible for updating user authorization tokens.

This approach allows you to easily segregate the functionality of the entire application, especially when simplicity, scalability and cross-platform compatibility are the basic requirements. A framework called NestJS was chosen to implement the server part of the entire application. This framework runs on TypeScript as a programming language and on NodeJS, which, as mentioned above, is a platform that enables JavaScript to run on the server side. Thanks to its modular structure, NestJS enables the creation of robust and easy-to-maintain server-side applications. The use of decorators similar to Angular in the framework increases the readability of the code and promotes efficient development. Using NestJS makes it easy to create RESTful APIs and microservices, providing a solid foundation for building efficient and extensible back-end systems.

## Databases

A database is a structured and organized set of data that is intended to be easily accessible, managed and updated. It serves as a repository for storing, retrieving and manipulating data in a systematic and efficient manner. Databases are fundamental components across a variety of domains, providing a structured mechanism for organizing and storing information for a variety of applications, including business operations, scientific research, and especially web development.

In the context of web development, databases play a key role in managing and persistently storing the data that powers dynamic websites and web applications. Website developers use databases to store information such as user profiles, product details, content, and more. The two basic types of databases used in website development and that were used in this project are relational databases, e.g. PostgreSQL, which is the main database in the project, and NoSQL databases, e.g. .MongoDB. Relational databases use structured tables with predefined relationships between them, while NoSQL databases offer a more flexible and schema-free approach that accommodates unstructured or semi-structured data.

## Cloud Technologies

Various cloud services are used to implement the application and make it available to the end user via the Internet. Cloud services provide a virtualized environment that eliminates the complexity associated with hardware provisioning and maintenance. In simple terms, this approach allows you to rent computing resources provided by the supplier. This approach is called IaaS (Infrastructure as a Service). Infrastructure as a Service (IaaS) is a cloud computing model that provides virtualized computing resources over the Internet. In the IaaS model, instead of investing in and maintaining physical hardware, users can rent virtualized computing resources such as virtual machines, storage, and networking components from a cloud service provider. This approach enables companies and individuals to dynamically scale their infrastructure without having to make significant upfront investments in hardware.

In an IaaS environment, users have control over operating systems, applications, and development platforms, allowing for greater flexibility and customization compared to other cloud service models. This flexibility makes IaaS well suited to a variety of applications, including hosting and running applications, development and test environments, and data storage. Key features of infrastructure as a service include on-demand provisioning, self-service capabilities, and a pay-as-you-go pricing model that charges users based on how they actually use resources. Popular examples of IaaS providers include Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP). Cloud resources from Amazon Web Services were used to create the infrastructure for this application. The resources they provided were used for every element of the application's infrastructure, including the server itself on which the application runs, the database server, and elements for storing static files such as icons and images.

An important point is that AWS only served as a provider of computing resources, other services were also used for other purposes. For example, Cloudflare was used as a service to manage the application domain name. This applies not only to the web server and the URL that the user enters in the address bar of his browser, but also to creating the necessary infrastructure for sending e-mails to users using the domain name.

## Containerization

Containerization in web software development is an approach that encapsulates applications and their dependencies into lightweight, portable units called containers. At its core, containerization is about connecting an application with its runtime environment, libraries, and other necessary components, ensuring consistency and eliminating environmental discrepancies between different stages of the software lifecycle. Docker, a widely adopted containerization platform, played a key role in this methodology and it was this technology that was used in this project to implement containerization. It is worth adding that in this project Docker containers were used only when writing the application code, because their use facilitates the management of all application subsystems.

It is designed in such a way that using one script located in the main project folder, three containers are launched simultaneously and are connected to one network, which also allows them to interact with each other. This system was implemented using a special tool called Docker Compose. This technology allows you to describe and run several containers at the same time using specially described files in the YAML format, as well as connect them into one network if communication between them is required. Thus, Docker's containerization technology allows you to save a lot of time and resources when writing code, and also greatly simplifies the process of managing all application subsystems.

# Front-end

The front-end, also called the client part, is a key element of the web application, serving as a user interface and facilitating user interaction with the base system. It includes the presentation layer responsible for rendering the visual elements that users perceive and interact with in their browsers. The primary goal of the front-end is to provide a smooth and engaging user experience by ensuring effective content display, responsiveness to user actions, and presentation of dynamic data.

Key front-end components include HTML (Hypertext Markup Language), which defines the structure and layout of web pages, CSS (Cascading Style Sheets), which governs the style and visual presentation of these pages, and JavaScript, the programming language that enables features dynamic and interactive. These technologies work together to create visually appealing, responsive and user-friendly interfaces.

## Components

One of the biggest advantages of the Angular framework is the ability to create your own components of any complexity. It can either be a component responsible for receiving data from the user or a component that acts as a page layout. Creating your own components not only simplifies code writing by increasing the repeatability of using different components, but also allows you to maintain the style and functionality of all components at once, since you only need to change the code in one place in the component.

For a more visual example, an input field component that is used to receive input from the user will be presented below, and the principles of its operation will be described. A ready-made component is used directly on the page itself, which is a regular HTML tag:

```html
<basic-input
  [label]="t('input.companyName')"
  [placeholder]="t('input.provideCompanyName')"
  [inputDescription]="t('input.companyDesc')"
  [errorMessage]="t('input.companyError')"
  [value]="companyName"
  [minLength]="2"
  [maxLength]="64"
  (valueChange)="companyName = $event"
  (incorrectInput)="incorrectCompanyName = $event"
/>
```

The attributes used by this tag are custom attributes used for so-called bindings. These bindings (or directives) come in 2 different types: property binding and event binding.

1. Property binding is a one-way data binding between a component and a property of the target. Used to set the target's property to the value of the component's property. As can be seen from the component example presented above, an example of such a connection may be a `label`. This basically means that a value is unilaterally passed to a component that is already being used by it. In the component itself, such bindings are indicated by the `@Input` decorator and the value is passed in square brackets.
2. Event binding is a one-way data binding from the target to the component. It is used to respond to events such as button clicks, mouse events, etc. At its core, this type of connection is a function that can capture something from a child component to its parent. In the component, such bindings are marked with the `@Output` decorator and are used with round brackets. Returning to the input component example, what the user types into these input fields is returned via the valueChange directive and through a special event variable ($event) that contains the value of the user's input field, writes it to a variable on this page called companyName.

Turning to the source code of the component itself, all directives, including property bindings and event bindings, of this component are marked with decorators depending on their type. Some of them allow you to add field names (`label`, `placeholder`), specify under what conditions this field should not be available to the user (`disabled`), when an error should appear and under what conditions (`showError`, `errorMessage`). Simplifying what has already been written above about property bindings, and also looking at the name of the decorator that is used for this, we can say that property binding directives are used as input to the component.

```typescript
@Input() label: string;
@Input() type = 'text';
@Input() placeholder: string;
@Input() value: string;
@Input() disabled = false;
@Input() showError = false;
@Input() errorMessage: string | null;
@Input() inputDescription: string | null;
@Input() minLength: number;
@Input() maxLength: number;
@Input() readOnly = false;
@Input() onWhite = false;
@Input() min: string;
@Input() max: string;
```

The other type of directives mentioned above were event linkages. From the name of the decorator used to create this field, you can tell that it serves as a function that returns something from the component to the parent component. This is done using so-called event emitters. An event generator is a class that takes as a generic type the data type that will be returned by this function. Using the `valueChange` event as an example, which responds to what the user enters, this event generator returns a string data type because everything the user enters is a string in the first place. This string, via the event variable (`$event`), is returned and can be processed in the parent component.

Since the data entered by the user may be of a special type (e.g. e-mail address or password), this component also includes logic for validating this data using regular expressions. If the user provides incorrect data that is not verified using these regular expressions, this information may also be returned using the `incorrectInput` and `passwordErrors` events. And already in the parent component, this data can be used, for example, to lock a button.

```typescript
@Output() valueChange = new EventEmitter<string>();
@Output() incorrectInput = new EventEmitter<boolean>();
@Output() passwordErrors = new EventEmitter<
  Array<{ error: boolean; text: string }>
>();
@Output() onSpace = new EventEmitter<boolean>();
```

Below is a screenshot (Fig. 5) from the registration page that clearly illustrates how the above directives, combined with HTML code, create a component that can be easily reused in different parts of the application.

| ![Picture5.png](static/Picture5.jpg) | 
|:--:| 
| *Fig. 5. View of the component for entering data from the user on the registration page. Source: own work* |

This flexibility allows you to create components of any complexity, as well as create components that can be used for completely different scenarios in different places. Thanks to this approach, it also allows you to keep all the logic segregated without mixing it in different components, thus maintaining the cleanliness and quality of the code at the appropriate level. Using the user input field example, you can see very clearly that just changing the data type of the field to password allows the process of checking the password against all rules to be immediately implemented and, if something happens, show the user an invalid password error message .

## Pages and Navigation

When talking about pages and navigation in this application, it is important to mention that every object in Angular is a component in one way or another, including pages. Page components, in turn, are combined into modules that enable management of these components. This approach allows you to easily manipulate these components to create navigation of any complexity. For example, the following code is a module code that combines all pages in the application responsible for user authentication and clearly illustrates how to determine paths to these pages:

```typescript
const routes: Routes = [
  {
    path: 'account-confirmation/:hash',
    component: AccountConfirmationComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    LayoutsModule,
    TranslocoModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
```

This module connects pages related to user authentication in the system, such as login, registration, password change and email address pages. In the code, such modules are declared using the `@NgModule` decorator, which accepts various parameters, including the module parameter with navigation - `RouterModule`. As the only parameter, this module accepts a list of objects, where each object is a component of the page, as well as the path to this page. As the only parameter, this module accepts a list of objects, where each object is a component of a page, as well as the path to this page. It is worth noting that the routing system also allows you to specify the names of dynamic parameters using the colon character. This approach can be very useful when it comes to implementing dynamic routing with multiple dynamically generated pages.

```typescript
ngOnInit() {
  this.translationService.setPageTitle(Titles.ACCOUNT_CONFIRMATION);

  this.route.paramMap.subscribe(async (params) => {
    const hash = params.get('hash');
    if (!hash) {
      await this.router.navigate(['login']);
    } else {
      this.hash = hash;
      this.confirmUserAccount(hash);
    }
  });
}
```

Such as in this case, where a randomly generated hash is used to confirm a user's account and is added to a link, and that link is emailed to the user. Then, when the user opens this link and navigates to the account confirmation page, which uses a special ngOnInit hook - a lifecycle hook that is called after Angular initializes all the directive's data-related properties, or in simpler terms, runs at that point , when a user visits a page and that page is initialized with data, from the URL, using the name that was used in the routing module, it is possible to retrieve this hash and start the user account confirmation process (Fig. 6).

| ![Picture6.png](static/Picture6.png) | 
|:--:| 
| *Fig. 6. Example URL to the account confirmation page using a dynamic parameter. Source: own work* |

## Communication with Back-end

Talking about the infrastructure features of this application, communication between the server part and the client takes place through a proxy server. For this reason, the implementation of this communication on the client side has certain features. Mainly, this feature is that when sending a request to the API through a proxy server, you must pass not only the request content or parameters, but also the HTTP method, controller name and endpoint to which the request should be sent. Also, the service responsible for starting the page loading animation was used directly in the request sending function. This means that every time a request is sent to the server, the service will automatically start a loading animation, so there is no need to worry whether it is working every time a website sends a request to the server. Additionally, as soon as the server receives a response, the animation will automatically turn off or, if the server's response was incorrect, an error message will be displayed to the user.

```typescript
apiProxyRequest({ controller, action, method, payload, params }: ProxyRequestInterface): Observable<any> {
  const requestUrl = `${this.frontProxyUrl}/${controller}/${action}`;
  const requestBody: {
    method: Method;
    params?: object;
    payload?: object;
  } = { method };
  const headers: { [key: string]: string } = {};

  if (params) requestBody.params = params;
  if (payload) requestBody.payload = payload;

  const request$ = this.http.post<any>(requestUrl, requestBody, {
    withCredentials: true,
    headers
  });

  this.loaderService.start();

  return request$.pipe(
    catchError(async (error) => {
      await this.errorHandler.errorHandler(error);
      throw error;
    }),
    finalize(() => {
      this.loaderService.stop();
    })
  );
}
```

According to the controllers available on the back-end, the appropriate services were recreated on the client side. However, they all use the above code to send requests. Below is an example code from the service responsible for all user authentication processes. As the name suggests, this function is responsible for user registration.

```typescript
registration(
  payload: RegistrationPayload
): Observable<{ message: RegistrationResponse }> {
  const language = localStorage.getItem('translocoLang');

  if (language) payload.language = language;

  return this.apiService.apiProxyRequest({
    method: Method.POST,
    controller: Controller.AUTH,
    action: AuthEndpoint.REGISTRATION,
    payload
  });
}
```

In addition to the payload variable directly containing the user data used during registration, a function that will send a request to the API via a proxy must also pass the method that this endpoint uses, along with the name of the controller and the name of the endpoint itself.

## Localization

Localization in web applications refers to the process of customizing the content, interface, and functionality of an application to meet the linguistic, cultural, and regional preferences of the target audience. This includes translating text elements, adapting date and time formats, and incorporating cultural nuances to enhance user experience and ensure effective communication in diverse global markets. The goal of localization is to create a consistent and culturally appropriate user interface, thereby promoting user engagement and acceptance across regions and linguistic communities. In this particular project, localization was carried out only at the level of translating the text of the interface elements into three languages ​​- Polish, English and Russian. The localization itself was implemented using a package called Transloco Angular.

This library allows you to translate text at runtime, without having to completely rebuild your application to apply the changes. The principle of operation is that a special class is created in the code to perform translation functions. This class describes what languages ​​will be used to translate text in the application, as well as other options, such as whether the page will automatically reload if the user changes the language. Based on the `@NgModule` decorator, we can say that this class is an Angular module and to connect it, just import it into the main module of the entire application.

```typescript
@NgModule({
  exports: [TranslocoModule],
  imports: [
    TranslocoPersistLangModule.forRoot({
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage
      }
    })
  ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'ru', 'pl'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule {}
```

The text translation itself is saved in JSON files in a special folder, and after the user first enters the website or changes the website language, using the HTTP protocol, the application can send a request and receive a translation for this language.

```typescript
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
```

The value of the translation language variable that the user is currently using is stored in local storage as one of the 3 available values. The key name for this variable in local storage – `translocoLang`. This value is required to remember the user's selection and to be able to automatically install the user's selected language each time the website is accessed. If the value is changed to a value that the application does not provide, then the language that was selected as default in the translation module shown above will be automatically installed (Fig. 7).

| ![Picture7.png](static/Picture7.jpg) | 
|:--:| 
| *Fig. 7. Language variable in local storage. Source: own work* |

In order to provide the user with the ability to manipulate the language of the website, a special component was created that is always visible to the user. This component displays a flag indicating what language the user has currently selected. The user can click and select a language from a list of 3 flags. This component is always located in visible places: in the user header and on all pages responsible for authentication (Fig. 8).

| ![Picture8.png](static/Picture8.jpg) | 
|:--:| 
| *Fig. 8. Component view responsible for changing the interface language. Source: own work* |

Before we discuss how text translation works at the code level, there is one more aspect that requires attention because it is related to the optimization of application performance. As mentioned above, translations for all three languages ​​are stored in a specially designated folder in JSON files. However, instead of saving the translation of absolutely every text, including components, errors and messages, it would be more rational to divide them into subfolders in which the files responsible for translating individual components or pages would already be saved - in other words, a scope system. It optimizes this application in such a way that it allows you not to request translation of absolutely every element in the entire application, including those that are not required in this case, thus saving a large amount of resources. Moreover, it allows you to maintain the structure and order of the code, which in the long run has a positive impact on the entire application development process (Fig. 9).

| ![Picture9.png](static/Picture9.jpg) | 
|:--:| 
| *Fig. 9. A subfolder containing the translation of error messages. Source: own work* |

At the code level, you only need to select the translations used on a given page or layout, including the components that are used there. The effect of this will be that after the user enters the website, the translation module will send requests to translate only specific fragments (Fig. 10). Below is an example of an application's network activity logs in a user authentication layout that includes login, registration, password change, email address, and account confirmation pages. The Transloco module will only send requests for these specific elements, as well as components that are used on these pages (text fields and buttons).

| ![Picture10.png](static/Picture10.jpg) | 
|:--:| 
| *Fig. 10. Request for translation via the Transloco module. Source: own work* |

An example of translating text in code has already been presented above in the section on components. It works like this: in Angular there is a special `ng-container` tag - this is a special element that can contain structural directives without adding new elements to the DOM. This element initializes the translation module variable, which is then used in other components and on the page.

```html
<ng-container *transloco="let t">
  <basic-input
    [label]="t('input.companyName')"
    [placeholder]="t('input.provideCompanyName')"
    [inputDescription]="t('input.companyDesc')"
    [errorMessage]="t('input.companyError')"
    [value]="companyName"
    [minLength]="2"
    [maxLength]="64"
    (valueChange)="companyName = $event"
    (incorrectInput)="incorrectCompanyName = $event"
  />
</ng-container>
```

In fact, this variable is a function that takes a string argument pointing to the path to a JSON file, as well as the name of a key in that JSON file, and then its value is substituted and used as the translation.

# Back-end

The back-end, or server part, of a web application is the basic infrastructure and logic that drives the application, manages data, business rules and general functionality. Responsible for processing requests from the front-end, interacting with databases and ensuring the correct implementation of business logic. It plays a key role in supporting and facilitating the dynamic and interactive features provided by the interface while ensuring data integrity, security, and overall system performance.

Key components include the server, database, and application server or runtime environment. The server handles requests coming from the front-end, performs the necessary operations and returns appropriate responses. The database stores and retrieves data, providing a durable and organized application storage solution. The application server hosts and executes server-side code, implementing business logic, handling authentication and authorization, and coordinating the overall behavior of the application.

Security is of utmost importance in back-end development and includes aspects such as data encryption, authentication mechanisms, and authorization protocols to protect sensitive information and guard against unauthorized access. Scalability is another critical factor, as the backend must be designed to effectively handle a growing user base and increased workload.

APIs play a key role in back-end development, serving as a communication bridge between the front-end and back-end. To facilitate seamless data exchange and interaction between two application layers, REST APIs are commonly used.

## Modules

In NestJS, a module is a basic organizational unit that contains related components, controllers, services, and other application functions. Modules provide a structured means to organize and partition code, supporting modularity and maintainability. They define the boundaries of application functionality, encapsulate dependencies, and facilitate separation of concerns, promoting a scalable and modular architectural design that follows the principles of dependency injection and modular programming. In other words, modules allow you to cover, describe, and isolate all the logical parts of an application from a coding perspective. For example, a module responsible for all operations related to authentication, a module responsible for performing operations on users, a module responsible for all operations within the company. When creating the NestJS server framework, developers were inspired by the infrastructure that was implemented in the Angular client framework (even file naming when creating a module using the CLI).

The naming convention for modules and components, both for Angular and NestJS, says that the name should look like this: first goes the name of the module, which is provided by the user, and then, after a dot, the type of the module (for example, controller or service), and then at the end the file extension. After creation, the module itself consists of 5 components described in 5 different files:

- Module – this file is the central file of the entire module that connects all other components. The class that is used for this uses a decorator with appropriate naming – `@Module`. Also as mentioned above, since modules are used to segregate logic, if there is a need to use the functionality of another service, then the module containing that service is imported into the import table of that module.
- Controller – the controller is the basic element responsible for handling incoming requests, processing them and returning the appropriate response. Controllers are responsible for handling HTTP requests from clients and contain endpoint handlers. This file contains all the endpoints for which this module is responsible. They, using the same decorators, directly describe the functions that should handle the request for this resource. The decorator itself describes the naming of the HTTP method, and as an argument it takes a string of characters that is responsible for the naming of the resource, as well as the parameters that this endpoint can use. After the controller accepts the request, it is forwarded to the website.
- Service – a service is a class that contains business logic that can be injected into controllers, modules or other services. Services are used to encapsulate and extract implementation details for specific tasks or functionality that an application needs. Services in NestJS work according to the single responsibility principle, which means that each service should have a clearly defined purpose and handle a specific set of tasks. They are responsible for ensuring reusability, maintainability, and clean separation of concerns in the application.
- Test files – additionally, by default, after creating a module using the CLI, two more files are created responsible for unit tests for the controller and the service, respectively.

As shown in the screenshot below (Fig. 11), after creating a module, all files belonging to it are located in one directory, which also allows you to maintain the transparency of the project structure and easy navigation through the project files.

| ![Picture11.png](static/Picture11.jpg) | 
|:--:| 
| *Fig. 11. Modules and their corresponding files are located in separate directories. Source: own work* |

In addition to all the modules that the user creates manually or using the CLI, there is one special module that is created when creating an application project. This module is named app.module.ts. This module is located in the very main file of the entire application and serves as a startup module that launches the entire application. All modules created by the user in the application are also imported into this module. Other settings that are used globally for the entire application, such as the database connection module and the module for reading environment variables, are also imported into the application module.

## DTO

Data Transfer Object (DTO) is a design pattern widely used in web application engineering to facilitate the efficient and secure exchange of data between different layers of an application or between separate software components. The primary goal of a DTO is to encapsulate and transport data between different parts of the system, protecting the underlying complexity of data structures from consumers or clients. This separation of concerns increases modularity and promotes a more organized and scalable software architecture.

DTOs typically consist of a set of attributes or fields representing the relevant data to be transmitted, stripped of any business logic or behavior. By serving as a container for data, DTOs help alleviate network latency issues, reduce the amount of data transferred, and increase the overall performance of distributed systems. Additionally, DTOs help improve maintainability and flexibility by separating the internal representation of data from its external representation during communication.

Regarding the frameworks used in this project, both use the JSON data format to exchange data. When transferring data, Angular uses a built-in HTTP module that automatically converts the TypeScript object to JSON, therefore it does not require a separate implementation of DTO objects. However, this feature is not available on the server side, which is implemented using NestJS. Additionally, DTOs on the server side also perform the function of validating input data. DTOs are implemented for both input data that is sent to a specific endpoint and output data that is returned to the client part in response from the server. At the code level, these objects are classes whose attributes describe the data that will be received or returned.

Below is the DTO that uses the endpoint responsible for initiating the user account password reset process. You will notice that this class has 2 fields, one of which is optional. The endpoint can only process received data if the field key name in the incoming JSON object matches the name of the attributes in the DTO object class. The remaining fields in this JSON object will be ignored.

In this code, decorators starting with `@Api` are responsible for creating OpenAPI documentation, which will be described below. The `@Matches` decorator takes as its first parameter a regular expression that will be used to check the value of a field with this name. The second parameter is the object or message that will be returned if that object fails the test of this regular expression. The `@IsOptional` decorator indicates that this field is optional. The `@IsEnum` decorator accepts an enum as a parameter, which is also used to check the correctness of the transmitted data.

```typescript
export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.EMAIL_DESC,
    example: DocsProperty.EMAIL_EXAMPLE
  })
  @Matches(EmailRegex, { message: ValidationError.WRONG_EMAIL_FORMAT })
  readonly email: string;

  @ApiProperty({
    type: Language,
    enum: Language,
    description: DocsProperty.LANGUAGE_DESC
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  readonly language?: Language;
}
```

This DTO is actually the request body for a specific endpoint. Therefore, to implement the validation and documentation described in this DTO, it is necessary at the endpoint, via the `@Body` decorator, to indicate that this class is the expected request body type for this function.

```typescript
@Post('forgot-password')
forgotPassword(
  @Body() payload: ForgotPasswordDto,
  @TrxDecorator() trx: Transaction
) {
  return this.usersService.forgotPassword({ payload, trx });
}
```

When it comes to DTO returning data, in this case the conversion of their class to a JSON object happens automatically. It is enough that the controller, as in the case of input data, returns a specific class with the given attribute values. As the following sample code shows, when the function is successfully executed, the user will receive a JSON object in response containing one key and one message value.

```typescript
export class ResetPasswordEmailDto {
  @ApiProperty({
    type: String,
    description: DocsProperty.RESET_PASSWORD_EMAIL_SENT_DESC,
    example: DocsProperty.RESET_PASSWORD_EMAIL_SENT_EXAMPLE
  })
  readonly message: string;

  constructor(message = 'reset-password-email-sent') {
    this.message = message;
  }
}
```

Also in the case of data that the user receives in response, special decorators were used to create documentation. However, when creating an object of the class, the user has the option of passing another message that will be returned to him. Otherwise, the user will receive the message stored in the constructor by default.

## Middleware

Middleware functions are software components that intervene in the communication process between a client and a server, facilitating additional logic or processing at various stages of the request-response cycle. This middleware enables cross-cutting issues such as authentication, logging, and input validation to be implemented in a modular and reusable way, promoting clean separation of concerns in the application. An important clarification is that, at its core, code-level middleware is a function that operates between 2 systems exchanging data in a request-response (or client-server) architecture and is capable of intercepting a request from a client and interacting with it in various ways. ways before it goes directly to the server.

In this particular project, several different intermediate functions are implemented. One of them is responsible for authorizing all requests sent to the server, while others have been implemented in the form of the so-called guards, which work on the same principle as middleware and are used to create an authentication and authorization system.

Another type of middleware that was used in this project are the so-called pipes. Pipes serve as intermediaries that act on input before or after it reaches a designated handler, allowing you to enforce validation, manipulate parameters, or apply custom transformations. This mechanism significantly increases code maintainability because it gives you the ability to encapsulate and reuse logic across multiple endpoints, promoting a consistent and standardized approach to data processing in your application. Pipes in NestJS can be divided into different categories, including validation pipes, transformation pipes, and custom pipes tailored to your specific requirements. For example, validators enable automatic validation of incoming data based on specific rules, increasing the reliability and robustness of applications. Transformation pipes, in turn, allow you to modify data before it reaches the route handler or before a response is sent, facilitating seamless integration with external services or optimizing the presentation of information. In this project, pipes were used to check and validate data coming from the user.

## Guards

Guards play a key role in enforcing security and authorization rules. They act as middleware components that intercept incoming requests before they reach functions, allowing you to implement custom authentication, authorization, and request validation logic.

Guards always return a boolean value - true or false. If the returned value is true, the guard allows the endpoint to process this request; otherwise, if the returned value is false, the guard will automatically report an error with HTTP code 403, i.e. Forbidden resource. Two guards were implemented in this project - `AuthGuard` and `RoleGuard`.

- `AuthGuard` – the authentication guard is responsible for checking the user's authentication when the user requests any resource protected by this guard from the server. User authentication and authorization are based on tokens, the principle of which will be described later; in fact, this gatekeeper is responsible for validating,type checking and validating the user's token. In case of any error, this guard will return an exception with an error and stop data processing by the given endpoint; otherwise, the unique user ID will be stored in the request header separately, if the user is a member of the company, the company ID will also be stored.
- `RoleGuard` – this guard is responsible for checking user roles, which, along with other information, are saved in tokens. The principle of its operation is similar to the method of checking the token by the authentication guard, except that if in the previous case information about the user ID was retrieved from the token, in this case the roles are retrieved and compared with which roles are allowed to use this resource.

Guards are assigned to endpoints using decorators, which will be described below. Other data is assigned to them in the same way, e.g. a list of roles with access to a specific endpoint.

## Decorators

In NestJS, a decorator is a special type of metadata annotation used to enrich and modify the behavior of classes and their members, such as methods and properties. Decorators allow you to define various aspects such as routing, dependency injection and middleware integration in the application. By leveraging the metadata reflecting capabilities of TypeScript, decorators in NestJS contribute to expressive and modular code, making it easy to implement features such as middleware, guarding, and parameter transformation in a declarative and structured way. Furthermore, in addition to the already available decorators, this framework allows you to create your own custom decorators that allow you to interact with other metadata as well as metadata that is also custom.

In both frames of this project, due to the specificity of their architecture, a variety of decorators were used, presented directly by the frames themselves. We didn't use any custom decorators when writing the client side, so we'll describe below which custom decorators were used on the server side. Some decorators allow you to read data added by interceptors or guards into the request header, while others allow you to add custom metadata to endpoints to further interact with them.

Another important explanation is that despite the wide functionality and ability to work with metadata provided by decorators, all decorators described below were used only in controllers.

- `@UserId` – using the authentication guard, a unique user ID will be added to the request header as a separate field, and then using this decorator it is possible to extract this ID and immediately pass it to the service, without wasting resources on checking, decrypting and downloading data about the user from his token in a separate operation.
- `@CompanyId` – similar to the previous decorator, but only if the user is a member of a company, the ID of that company is entered in a separate field in the header that can be read by this decorator.
- `@CookieRefreshToken` – the user authentication system works based on 2 tokens, the principle of operation and interaction of which will be detailed in the following chapters. This is an access token and a refresh token. The access token is saved in a separate field in the request header, while the refresh token is saved in the cookie. This decorator allows you to extract the refresh token from the cookie. Additionally, it is only used in one place, in the authenticator in the function to update these tokens.
- `@Roles` – The role decorator is a decorator that adds custom metadata to an endpoint. This decorator is used only for endpoints that are located in modules responsible for interactions with companies and their users. This decorator takes a list of roles that can access this endpoint, and if a user is authenticated but does not have the appropriate role, they will not be able to access this endpoint. This decorator works with the RoleGuard, whose main task is to read the user roles stored in the token and compare them with the roles provided by this decorator.
- `@TrxDecorator` – this decorator allows you to extract the transaction object from the request header, which is added there by a special global interceptor. Transactions are used to maintain the integrity of the database. This decorator and interceptor, as well as the principle of their operation, will be described in more detail in the section devoted to the database.

Using decorators in this way allows you to significantly reduce the amount of code written, thus maintaining its cleanliness and using the full potential of the server-side framework for working with metadata.

# Databases Technologies

The database is used to store all the data that is used in the application. This includes data from users, companies, sessions and products. There are many different databases and types of databases that can be used to store data. Choosing a specific type of database and engine depends on what goals you want to achieve, as well as what data will be stored in the database. This project used 2 different databases of two different types for different purposes - PostgreSQL and MongoDB. This section will describe the database that was used to store the application data, while the other database that was used to store the application logs will be described in the corresponding section.

PostgreSQL was chosen as the main database to store all information. It is an open-source Relational Database Management System (RDBMS), known for its robustness, extensibility and compatibility with SQL standards. A relational database is a type of database that organizes data into tables of rows and columns, where each row represents a record and each column represents a specific attribute or field of that record. Relationships between tables are established using keys, which allows for efficient storage, search and management of data. From the point of view of infrastructure and code, the application interacts with the database not directly, but through the so-called ORM. Below is a database diagram that will show all the tables used in the project, as well as their connections to each other. (Fig. 12)

| ![Picture12.png](static/Picture12.png) | 
|:--:| 
| *Fig. 12. Database ERD. Source: own work* |

## ORM

ORM (Object-Relational Mapping) stands for Object-Relational Mapping. It is a programming technique that allows programmers to interact with a relational database using an object-oriented paradigm. Instead of writing SQL queries directly, developers can use programming language constructs (such as classes and objects) to interact with the database, and the ORM system takes care of translating these interactions into appropriate SQL statements. In this project, Sequelize was chosen as the ORM.

Sequelize is an ORM for Node.js, designed specifically to work with relational databases. This ORM simplifies interaction with databases by providing a set of abstractions and methods that developers can use in their applications instead of working with the database directly or manually querying the database in the application using SQL. Sequelize provides a full set of functionality for interacting with the database, this will include not only reading and writing records, but also migrations, data validation, transactions and associations between tables in the database.

## Database Models

When it comes to database development, different approaches are commonly used, and the two dominant paradigms are Code-First and Database-First. These approaches address the order and manner in which application code and database schema are created.

- In the Database-First approach, developers start with an existing database or database design tool to define the schema. Once the database schema is finalized, the tool or framework generates appropriate code (e.g., classes or entities) based on the database structure. Developers then write application code that interacts with the generated entities.
- In the Code-First approach, developers start by defining the application's data model using programming language constructs (such as classes or objects). Once the data model is defined, the tool or framework is used to generate a database schema from the code. The database is created or modified based on the structure and relationships defined in the code. This approach is often associated with object-relational mapping (ORM) frameworks.

As can be seen from the above description, this project used an approach of creating the database when the code is written first - Code-First. The Sequelize framework used for this purpose allows you to describe tables in a relational database using classes in the code, which after running the project are transformed into tables directly in the database itself. Some fragments of the model and user database table code will be presented and described below.

In the approach where the database is created at the code level, each individual table in the database is a separate class for which a special Sequelize decorator - `@Table` - is used to indicate that this class will be a table in the database. Moreover, this decorator accepts various parameters that, as in this case, allow you to determine the name of the table in the database. As you can see, this class inherits from the Model class from Sequalize and takes the class itself as generic types, as well as an interface indicating what minimum set of attributes is required to create one record in this table.

Then, using the attributes of this class, as well as using decorators - `@Column` - all columns are described, which after running the project will be transformed into separate columns in the database, and in turn, from the code level it will be possible to access the values ​​of these columns through the attributes of this class . These decorators allow you to specify various properties for these columns. Such as default value, data type, field sizes and names, and column types (primary key, timestamps).

```typescript
interface UserCreationAttributes {
  email: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'first_name' })
  firstName: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
```

Sequalize, being a full-fledged ORM, in addition to creating tables in the database, also allows you to connect them together using foreign keys. This is also done using special decorators and requires the presence of decorators on both tables, which must be connected to each other.

```typescript
@HasOne(() => CompanyUser)
companyUser: CompanyUser;

@HasOne(() => UserSettings)
userSettings: UserSettings;
```

Another important explanation is that using ORM saves developers from manually creating the database and all the tables. When you run the application for the first time and connect the API to the database, Sequelize will automatically create the database with all the tables and their connections. Moreover, to modify an already existing database, just modify the code already written and the ORM will also update the database automatically. Thanks to this, the programmer does not have to work directly with SQL.

## Transactions and Databases Interceptors

In order to maintain the integrity of information in the database, the so-called transactions. A database transaction is a separate, indivisible unit of work in a database management system, characterized by the principles of ACID (Atomicity, Consistency, Isolation, Durability). It involves a series of operations, such as retrieving, modifying or deleting data, that are performed as a coherent whole. Transactions ensure that the database remains in a consistent and reliable state by committing all changes upon successful completion or reverting to a previous state upon failure at any point during the transaction. Transactions are used so that in the event of an unexpected error, the consequence of which would be unfinished work with the database and, for example, adding a record to the database without the corresponding foreign key, it is possible to return to the previous state of the database. Therefore, to maintain the integrity of the entire database, it is recommended to use transactions wherever any data manipulation activities occur.

In this project, interceptors were used to implement this functionality. In NestJS, an interceptor is a formalized middleware component that allows you to capture and manipulate incoming requests or outgoing responses at various points in the application lifecycle. Interceptors are implemented as classes and can be selectively applied to controllers or methods, allowing developers to perform pre- or post-processing logic, perform authentication checks, modify data, or handle errors in a modular and reusable manner. Using NestJS interceptors improves code organization and helps separate concerns by capturing the cross-cutting concerns of processing requests and generating responses.

In this case, a global interceptor has been implemented that adds a transaction to each request before it reaches the controller function and processing of the request begins. Below is the code of this interceptor along with a detailed description of its operation on the example of one of the controllers:

```typescript
const httpContext = context.switchToHttp();
const req = httpContext.getRequest();

const transaction: Transaction = await this.sequelizeInstance.transaction();
req.transaction = transaction;

return next.handle().pipe(
  tap(async () => {
    await transaction.commit();
  }),
  catchError(async (err: HttpException) => {
    await transaction.rollback();

    const errorMessage = err.message || 'internal-server-error';
    const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    throw new HttpException(errorMessage, errorStatus);
  })
```

The principle behind this interceptor is that before a request reaches the controller for further processing, a transaction is added to it. If the request is successfully processed, the transaction is committed, completing one unit of data processing in the database; otherwise, if an error occurs somewhere along the data processing path, the transaction will be canceled (rollback), thus returning the state of the entire database up to the moment before the request began.

Since this transaction object must be used in the function, it must first be extracted from the request body and passed directly to the function. To implement this functionality, the already mentioned decorators were used, more precisely the decorator called TrxDecorator. This transaction decorator allows you to retrieve the object of this transaction added by the interceptor in the controller. Below is the code for this decorator, as well as an example of an endpoint in a controller that uses this decorator:

```typescript
export const TrxDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.transaction;
  }
);

@Post('registration')
registration(
  @Body() payload: CreateUserDto,
  @TrxDecorator() trx: Transaction
) {
  return this.authService.registration({ payload, trx });
}
```

Then, the object of this transaction is passed on the website to every function that interacts with the database. This combination of interceptors and database transaction concepts allows you to very effectively maintain the integrity of your database at any time you interact with it.

# Concepts of Security Measures

Web application security refers to the measures and practices put in place to protect the application, its data, and users from various threats and vulnerabilities. This includes protection against unauthorized access, data breaches, data manipulation and other potential threats that may compromise the integrity, confidentiality and availability of the application and its resources.

Based on the project concept described above, which assumes the existence of two types of accounts - an end-user account and a corporate account, there is a need to implement security measures that differentiate the access and functionality of these accounts, as well as to protect them against unauthorized access. Therefore, before proceeding with direct implementation using the technologies described above, it is necessary to describe the high-level concepts that will be used.

There are various models and frameworks that describe at a high conceptual level how data security should be achieved. In the context of ensuring data security in web applications, a good example of such a framework is AAA (Authentication, Authorization, and Accounting) - authentication, authorization and logging is a security structure that controls access to system resources, enforces rules and audits use. AAA and its connected processes play a major role in system management by monitoring users and tracking their activity.

## Authentication

Authentication – authentication involves the user providing information about who he is. Users provide login credentials that prove they are who they say they are. The engine then compares the user's credentials against a database of stored credentials, verifying that the username, password, and other authentication tools match that particular user's credentials. Authentication may apply not only to the end user, but also, for example, to the API itself, which will essentially require a special key to process the request. Both end-user authentication and API mechanisms will be implemented in this project.

Depending on where this mechanism is implemented (computer network, web application, etc.), the way login data is compared, as well as the login data itself, will vary from case to case. In the case of a web application, the authentication process usually involves providing a login (e.g. username or e-mail address) and password.

It is worth mentioning that there are 3 types of authentication: something you know - this is the traditional username and password combination, representing knowledge-based authentication - something you have - factor this refers to a physical device or item that the user has. Common examples are smart cards, security tokens or mobile devices that generate one-time passcodes (OTPs) via apps or SMS - and something you are - this factor is based on biometric data such as fingerprints, retina scans or facial recognition to authenticate a user based on their unique physical characteristics. Only the following 2 multi-factor authentication methods will be implemented in this project:

- Something you know – This factor is the most common and basic method for all web applications. The user will use his/her e-mail address and password for unique identification. This pair creates something that only the end user knows and can therefore be used for authentication.
- Something you have – This factor adds an additional layer of security by requiring a physical item in addition to knowledge-based authentication. Even if someone gains access to your password, they will still need a physical device or object to complete the authentication process. This approach increases the overall security of the authentication process and helps protect against unauthorized access even if the password is compromised. In this project, this factor was implemented using the 2 methods mentioned above: one-time access codes (OTP) via the application and SMS.

Using two or more different authentication methods is called multi-factor authentication or MFA (Multi-Factor Authentication). Using multiple authentication methods can greatly increase data security because even if one element is compromised, such as a user's password is stolen, the attacker will need to access one or more multi-factor authentication elements to gain access to the user's account, which definitely complicates the hacking process. The way in which the end-user authentication process works in a given system of this project is shown in detail in Annex 1.

## Authorization

Authorization – authorization occurs after authentication. During authorization, a user may be given access rights to specific areas of the network or system. The areas and sets of permissions granted to a user are stored in the database along with the user's identity. Authorization differs from authentication in that authentication only verifies the user's identity, whereas authorization determines what the user can do and what subsystems he or she has access to.

It should be clarified that authorization may be optional in a deployment if the architecture of the system or web application does not imply the presence of different roles with different levels of access. Authorization and everything related to it applies only to users who are members of companies, because in the case of an ordinary end user logged into the system, such an arrangement of roles does not make sense. It is also worth clarifying that in some of these systems, roles can either be recreated and assigned natively, at the code level, or they can be recreated by an administrator (who is the end user) and assigned to different users. For this project, a blended approach of the two described above will be used. In practice this means the following:

- The entire role system is based on scope. There are different scopes in a system that generally describe a certain set or group of functions. For example, the scope of user management describes all the functions used to manage users in a company. This includes inviting users, removing users, and editing their information. It is worth clarifying that these ranges are divided into two types - read-only and edit. By using combinations of these scopes, as well as their types, an administrator can create many different roles to cover all possible cases. This approach is ideal for full compliance with the principle of least privilege, a security concept and best practice that suggests that people, programs, or processes should be granted the minimum level of access or privileges necessary to perform their tasks or functions, and no more.
- The approach described above is under the control of end users. However, as written above, since a mixed approach was used to create the role system, the second part of implementing this approach is that some roles, such as the business owner role, are created and saved in the database when you set up a business account. This role cannot be deleted (only by completely deleting the company), but can only be transferred to another user. This role also has access to unique features that are not available to other users in the company and cannot be accessed through roles created by the administrator. In order to limit access to functions such as deleting a company or transferring the owner role, an approach is used that limits access at the code level of the application itself, without the possibility of removing this role.

The role system allows for a very flexible configuration of access to various project functionalities, but more importantly, this functionality is under the control of the end user and allows him to configure different roles and access levels depending on specific requirements.

## Account Recovery Keys

One concept for keeping users' personal information safe is account recovery keys. When creating an account, the user is obliged to secure his account by selecting one of the two available multi-factor authentication methods and to generate these keys. These keys are used in the event that a user loses access to a multi-factor authentication method (for example, a user has lost their mobile phone or lost access to their phone number) and allows them to reset their password and configure a new MFA method.

Basically, these keys are 5 hexadecimal encoded strings, each 1024 characters long. When generating them, the user must come up with a password whose hash will be used to encrypt these keys. These encrypted keys are then used to create a fingerprint using the SHA512 hash function, which is stored in the database. The user, in turn, receives these keys in unencrypted form in response.

If the user wants to restore access to the account using keys, he will have to enter these 5 keys, as well as the password that was used when generating them. The procedure described above is repeated and if the fingerprints match, the user's password and MFA are reset, allowing them to be configured from scratch.

## Logs

Logging, or saving logs, is a key element of an effective information security strategy. It provides visibility into what's happening in your web application, helps detect and respond to security incidents, and supports compliance and accountability. Properly implemented logging systems can be a valuable resource in protecting your application and its data.

As already mentioned in the section on application infrastructure, the proxy server is responsible for creating logs. It sends these logs to the MongoDB cloud database. The role of the entity responsible for creating logs is taken over by a proxy server for 2 reasons:

1. Absolutely all requests, responses and errors go through the proxy server. Therefore, the proxy server is able to record absolutely all activities that occur during the interaction between the client part and the server.
2. By taking over the responsibility for recording logs, the proxy server frees the API from this, thus increasing its efficiency.
It is also worth mentioning that the login system can be recreated on 2 levels, as in this project. This means that logs are saved not only at the level of the application itself, which can help its developers catch errors and conduct internal investigations, but also at the level of users of this application, which means that the user can see all his activities that are recorded in a separate section, e.g. password change, invitation to the company, etc.

A well-written log system helps ensure system integrity by providing system administrators with all the data about what happened in the system and when, as well as who initiated these actions, which in the event of a security incident will allow them to create a complete picture of what happened.

## User Input Data Validation

There are various documents and regulations based on statistics about the most common vulnerabilities in web applications, which describe the most popular ones at a high level of abstraction (made to be as universal as possible), as well as how these vulnerabilities can be fixed. One such document is the OWASP Top 10. OWASP Top 10 is the standard document for developers on web application security topics. It represents a broad consensus on the most important security threats to web applications.

At the top of this list are invariably various types of injections into web applications. Often, this issue occurs due to incorrect validation of end-user input.

This document states that 94% of applications have been tested for some form of injection, and the 33 CWEs assigned to this category have the second highest number of cases in applications. Cross-site Scripting is now part of this category in this release.

The most destructive impact is the lack of validation of user input on the server, because its incorrect interpretation allows the user to gain access to data that he should not normally have access to - SQL Injection or XSS (Cross-Site Scripting). Therefore, the factor of validation and sanitization of user input data at all stages is very important - from their entry by the user at the front end, to their processing directly by the server.

## Error Handling

Error management is an extremely important, yet underestimated method of ensuring the digital security of the entire system. The problem is that if errors are handled incorrectly, there is a risk of unpredictable system behavior that can have disastrous consequences. This is a list of possible consequences:

- Denial of Service (DoS) – as the name suggests, a denial of service error due to an unexpected error (or more precisely due to the way in which the error was or was not caught) will result in a complete system failure that may require a complete reboot, which will cause accessibility problems.
- Data leakage - when talking about data leakage, it is worth mentioning that we are talking not only about private user data, but also about the data of the entire system as a whole - what technologies, frameworks and programming languages ​​are used to create, what operating system runs on the server, what version of installed applications and so on. Regardless of the type of data breach that results from improper error handling, it compromises data privacy and confidentiality.
- User experience (UX/UI) – incorrect error handling can also result in a quite poor end-user experience who, instead of seeing an understandable message, may see something that would only be understandable to the application developers or another programmer.

You should also apply good error handling practices to all parts of your application infrastructure. It is worth mentioning that it is also necessary to create a mechanism that will catch not only local errors, but also global, unexpected errors.

# Implementation of Security Measures

In order to ensure the security of the entire application, it is necessary to ensure the security of all its elements, as presented in Figure 1. This includes: front-end, back-end, proxy server, database and the entire infrastructure. It is important to clarify that application information security includes both malicious activities aimed at compromising the application's security and unexpected user behavior. However, both of these cases require special attention and consideration.

## Security Measures on Front-end

What the front-end is, i.e. the client part, and what it consists of, has been described above. From a security perspective, the problem is that the user somehow has direct contact with all 3 basic elements of the page - HTML, CSS, JavaScript - and with the appropriate technical knowledge can modify them, which can lead to unpredictable consequences, ranging from incorrect behavior the visual part of the website, and ending with a complete refusal to support the entire application for all clients.

### Validation of User Input on Front-end

Ensuring client-side security of a web application relies largely on proper validation of user input. OWASP Top 10 The first lines of this list are still various types of injections. Most often, this is somehow related to incorrect validation of end-user input data, so cleaning or sanitizing them (both on the client and server side) is an important element of ensuring the information security of the entire application.

Angular, being a high-level framework, allows you to create your own HTML components with logic of any complexity. This approach allows you to reduce the amount of resources spent on writing code, as well as create a uniform coding style throughout the project. There are 2 types of fields used for user input - `<input>` and `<textarea>`. In order to implement the logic of checking user input data, the `<basic-input>` field was created, which accepts one of the input parameters as the data type it works with - `type`.

```html
<basic-input
  type="email"
  [label]="t(’input.provideEmail’)"
  [placeholder]="t(’input.email’)"
  [errorMessage]="t(’input.wrongEmailFormat’)"
  [value]="email"
  (valueChange)="email = $event"
  (incorrectInput)="incorrectEmail = $event"
/>
```

The above example of such a field is used on the registration and login page, when the user must provide his or her e-mail address. Please note that the type of this field is email. Then, when the user enters a value in this field, the component logic runs code that checks whether the email address the user entered is an email address.

```typescript
if (this.type === ’email’ && this.isValuePresent()) {
  const isEmailIncorrect = !this.validationService.isEmailCorrect(
    this.value
  );
  this.showError = isEmailIncorrect;
  this.incorrectInput.emit(isEmailIncorrect);
  if (isEmailIncorrect) this.showError = true;
}
```

Next, if the type is email, the component calls the validation service to check whether the given string is an email address. The check is performed using an RFC5322-based regular expression.

```typescript
isEmailCorrect(email: string) {
  if (email) {
    const regex = new RegExp(
     "[a-z0-9!#$%&’*+/=?^_‘{|}~-]+
      (?:\\.[a-z0-9!#$%&’*+/=?^_‘{|}~-]+)*@(?:[a-z0-9]
      (?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
);
    return regex.test(email);
  } else return email === ’’;
}
```

If the user enters an invalid email address that does not match the above regular expression, this function will return the logical value `false`. This value will be saved to 2 variables - `incorrectInput` and `showError`. By using the value of the first variable - `incorrectInput` - it is possible to disable the button and prevent the user from continuing if the address they entered is not an email address, and the second variable - `showError` - can be used to show the user an error. The value from the `incorrectInput` variable is written to the `incorrectEmail` variable which then, if true, disables the continue button. The same thing happens with the showError variable, which, if also true, will display the message passed by the `[errorMessage]` directive under the input field. It is also worth mentioning that this functionality has been implemented not only for the email address, but also for the password. A user can create a password by following several rules. These rules are checked by a special function that, if necessary, can tell the user which specific rule has not been applied:

1. Password length should be longer than 8 characters.
2. The password should contain at least one lowercase letter.
3. The password should contain at least one special character.
4. The password should contain at least one digit.
5. The password should contain at least one uppercase letter.

The code implementation of this function is as follows:

```typescript
async checkPasswordsRules(password: string) {
  const passwordRules = [
    { error: true, text: rules.eightChars },
    { error: true, text: rules.lower },
    { error: true, text: rules.spec },
    { error: true, text: rules.digit },
    { error: true, text: rules.upper }];
  if (password) {
    if (password.length >= 8) {
     passwordRules[0].error = false;
    }
    if (/[a-z]/.test(password)) {
     passwordRules[1].error = false;
    }
    if (/[#?!@$%^&*-]/.test(password)) {
     passwordRules[2].error = false;
    }
    if (/\d/.test(password)) {
     passwordRules[3].error = false;
    }
    if (/[A-Z]/.test(password)) {
     passwordRules[4].error = false;
    }
}
  return passwordRules;
}
```

Similar features have also been implemented for other elements such as phone number, domain name (FQDN - Fully Qualified Domain Name), Base64 PNG photo and other elements. Code elements will be presented below along with the implementation of these checks using regular expressions.

```typescript
isFQDN(domain: string) {
  if (domain) {
    const regex = new RegExp(
     /^(?!.*?_.*?)(?!(?:[\w]+?\.)?\-[\w\.\-]*?)
     (?![\w]+?\-\.(?:[\w\.\-]+?))(?=[\w])(?=[\w\.\-]*?\.+[\w\.\-]*?)
     (?![\w\.\-]{254})(?!(?:\.?[\w\-\.]*?[\w\-]{64,}\.)+?)[\w\.\-]+?
     (?<![\w\-\.]*?\.[\d]+?)(?<=[\w\-]{2,})(?<![\w\-]{25})$/
);
    return regex.test(domain);
  } else return domain === ’’ || domain === undefined || domain === null;
}

checkBase64PngImage(image: string) {
  if (image) {
    const regex = new RegExp(/data:image\/png;base64,([^]*)/);
    return regex.test(image);
  }
  return image === ’’;
}

checkPhoneFormat(phone: string) {
  if (phone) {
    const regex = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
    return regex.test(phone);
  }
  return phone === ’’;
}
```

In this way, using regular expressions, the data entered by the user is checked and verified on the client side. It is worth remembering, however, that there is also a server part that is responsible for direct processing of this data. Therefore, properly implemented data validation requires it on both the client and server sides.

### User Authentication on Front-end

### Multi-Factor Authentication on Front-end

### Account Recovery Keys on Front-end

###	Error Handling on Front-end

## Security Measures on Back-end

### Validation of User Input on Back-end

### User Authentication on Back-end

### Multi-Factor Authentication on Back-end

### Account Recovery Keys on Back-end

### Error Handling on Back-end

### User Access on Back-end

## Proxy Server

### Protection of Cookies

### Authentication of API

### Saving Logs

### Error Handling on Proxy Server

## Implementation of Security Measures for Intrastructure

### AWS IAM

### AWS S3

### AWS EC2

### AWS RDS

### Nginx Web Server and TLS/SSL

### DNS and e-mail infrastructure

# Application Deployment

Application deployment is a critical and carefully structured process in software development, marking the transition from a development environment to a production environment. This complex procedure involves systematically releasing and installing applications or updates, ensuring seamless integration with the target infrastructure while minimizing disruption to end users. The implementation process involves a series of well-defined steps, starting with thorough testing in a controlled environment to verify application functionality, performance and compatibility.

After successful testing, the implementation process moves to the test phase, in which the application is prepared for release by configuring the necessary parameters and optimizing the use of resources. The next step involves actual deployment, where the application is distributed to production, requiring careful consideration of factors such as data migration, system compatibility, and user acceptance. Once implemented, rigorous monitoring and evaluation is essential to quickly detect and correct any unforeseen problems. The primary goal of the application implementation process is to smoothly introduce new functionalities or improvements while maintaining the integrity and stability of the production environment.

Although this project did not recreate a separate infrastructure that would host a full copy of the application for internal testing by developers, testing is still an integral automated part of the application deployment, and some testing was performed manually during the actual application development process and the application goes through certain procedures, which allow you to check its operation and the security of the libraries used. In turn, the entire application implementation process was carried out using the Git version control system platform called GitHub.

## Version Control System

## CI/CD

## GitHub Actions

## Deployment on EC2

# Tests of Application

Testing is an essential aspect of web application development, covering both front-end and back-end components to ensure the reliability, functionality, and security of the entire system. In a web development environment, tests can be divided into 3 categories:

1. **Unit tests** – focus on isolating and verifying the correctness of individual units or components of the application. These units are typically the smallest testable parts, such as functions or methods, and unit tests evaluate their behavior in isolation from the rest of the system. By checking the functionality of each unit independently, developers can identify and fix issues early in the development process, supporting code modularity and maintainability.
2. **Integration testing** – evaluates the interactions and cooperation between various units or components in the system. These tests evaluate integration points to ensure that the connected entities function as expected when integrated. Integration testing helps detect problems that may arise when multiple components interact, providing insight into the overall behavior of the system and its ability to handle data flow and communication between different modules.
3. **End-to-end testing** (e2e) – assesses the functionality of the entire application by simulating real scenarios and user interactions. These tests evaluate the application from the user's perspective, spanning multiple layers and components. End-to-end testing is crucial to validating the overall functionality, user experience and workflow of an application, identifying potential issues that may arise in real-world use.

The first 2 types of tests are used to check whether the logic in the components works correctly. Hence, it becomes clear that in case of web application development, these tests will be used to test the back-end of the application. As mentioned above, unit tests are responsible for testing individual components of an application. In the case of this project, these components are controllers and services. Integration tests, in turn, are responsible for verifying whether controllers and services communicate with each other properly. When talking about end-to-end tests, they are used on the client side of an application to assess the health of the application from the end user's perspective. Such tests are able to simulate the end-user's interaction with the application's graphical interface. This gives you the ability to write and check individual user action scenarios, such as creating an account, logging in, deleting an account, and the like. Separate frameworks are used to write tests. For example, a separate framework called Jest is used to write unit tests and integration tests for the NestJS framework. To simulate user behavior through end-to-end testing, testing frameworks such as Cypress are used.

Due to the fact that all the business logic necessary for the proper operation of the application is located on the back-end, unit and integration tests were written for all controllers and services of this application using the Jest framework. Talking about end-to-end testing, it was done manually while creating separate pages, components and connecting business logic to them.

## Unit and integration testing using Jest

It is a widely adopted testing framework recognized for its simplicity, versatility, and advanced features in the field of JavaScript testing. In the context of NestJS, Jest is a native testing framework. It supports a wide range of testing methodologies, including unit testing, integration testing, and end-to-end testing, allowing you to verify the functionality and behavior of your NestJS application at multiple levels. The big advantage of this framework is that it is able to simulate the operation of the components used and does not use the resources of the running production version of the application or any resources (although it is also possible to use a test framework). Moreover, a database is not required because Jest allows you to create mock data. These 2 facts allow you to use this framework to fully replicate and test the entire business logic of the application to verify the correctness of its operation.

It was mentioned above that when you create a new module, NestJS automatically creates 2 additional files which are the files where tests are written using Jest for the controller and service respectively.

Before moving directly to the description of the tests themselves, it is worth explaining how the framework itself is organized for testing. The framework has 2 key functions at its disposal for its work – `describe` and `it` (or `test`). The describe function divides the test suite into components. In this case, components mean individual functions. In the case of controllers, these are endpoints, and in the case of services, these are functions that deal directly with the implementation of business logic. The test function (`it` or `test`) already deals with implementing a separate individual test or scenario for that particular function or component.

In terms of test implementation, tests are written differently for controllers and services. In the case of controllers, their correct interaction with the data received by a given endpoint is tested. In fact, tests for all controllers and endpoints are unit tests because they check the correct operation of only one single component of the entire back-end in one test (the controller and its endpoint). The following sample code is the test code for the user login endpoint:

```typescript
describe('Login', () => {
  it('Should call login with correct parameters', async () => {
    const payload: LogInUserDto = {
      email: 'test@test.com',
      password: '12qw!@QW',
      phoneCode: '123123',
      mfaCode: '123123'
    };
    const trx: any = {};

    await controller.login(payload, trx);

    expect(authService.login).toHaveBeenCalledWith({
      payload,
      trx
    });
  }, 20000);
}); 
```

The situation is different in the case of tests for websites. First of all, these are integration tests because they check the performance of many components at the same time and their ability to interact. It is also worth noting that in this case, due to the fact that for one function there may be a large number of scenarios that need to be described in individual tests. For example, when an end user logs in, the test must validate the server's response depending on the user's input. If the user entered all the data correctly, he receives 2 tokens as a response, if the user entered an incorrect password or MFA code, he should receive the appropriate message, etc. The code below (authentication service test, login function) checks the correctness of the business logic responsible for the response from the server in case the user has not set up multi-factor authentication on their account:

```typescript
it('should throw AccountNotConfirmedException if account is not confirmed', async () => {
  jest.spyOn(usersService, 'verifyUserCredentials').mockResolvedValueOnce({
    ...mockUser,
    confirmationHashes: [mockUnconfirmedRegistrationHash],
    isMfaSet: true
  } as unknown as User);

  await expect(async () => {
    await service.login({
      payload: mockPayload
    });
  }).rejects.toThrow(AccountNotConfirmedException);
}, 20000);
```

Particular attention should be paid to the simulation data already mentioned. In this scenario, when the application does not directly access and interact with the database, it is possible to describe what a function should return as if it were a production version of the application. This not only allows you to secure the database, reducing the likelihood of data being written or modified, but also significantly saves the resources required to test all back-end components of the application. Moreover, this approach allows you to create a test environment for applications in the CI / CD pipeline, which will be described in the next section.

## Automatic testing during application deployment

# Documentation

## OpenAPI

## Swagger

## Views of Application

# Last Word

In order to summarize the work performed, it is necessary to check whether the resulting applications meet the business tasks set at the beginning.

The first and most important business goal from the point of view of the entire application infrastructure was to create a highly efficient and scalable platform. Various cloud platforms were used to achieve this goal, among which AWS was the main platform. Absolutely all application servers, including the virtual machines that the application runs on, as well as various cloud storage such as S3 and the RDS database, have been implemented and configured to communicate with each other precisely using AWS as the main cloud platform. Taking into account all the available AWS tools, as well as the fact that throughout the development and implementation of the offer there were never any difficulties with the application servers, this business goal can be safely considered as met.

While writing the code and working on the entire project, the issue of security and protection of user data was given a separate, important role. This goal can also be considered clearly fulfilled because each level of the project has implemented its own security measures. Ranging from using special source code versioning tools, namely a special token that only has access to this repository, and CI/CD secrets management tools, to using TLS/SSL HTTPS certificates and DNS proxy to hide server information .

Another important goal is to leverage a scalable architecture and technology stack. To create the project, tools were selected that will help ensure its long-term support. This means that for a long time it will still be possible to find programmers on the labor market who have the skills to work using these technologies. Angular is a Google product that both the company and the user community have been supporting and developing for a long time. NestJS is an open source technology that has also been developed by the community for a long time. And tech giant AWS is a near-monopoly in the cloud space.

A logical continuation of the previous task performed can be considered the task of creating APIs for the server part of the application, which is not only responsible for implementing the business logic of the entire application, but also allows the same easy integration with other APIs.

The next two tasks that were successfully completed could be considered as setting up an internal analytics system and recording all application logs and the CI/CD system. Absolutely all application logs using the proxy server are saved to the MongoDB cloud database. In addition, a tool called PM2, which allows you to simultaneously manage multiple server processes, including workers on application part servers, also successfully copes with the task of writing logs. GitHub's GitHub Actions tool (which is used to manage source code versions) fully copes with the task of implementing CI/CD and creating application deployment infrastructure without direct interaction with servers.

The last task and the last successfully completed task can be considered as end user interface implementation and UI/UX development. This includes not only creating an aesthetic look for the website, but also translating the website into 3 languages, as well as creating different color themes for the website (dark and light).

Despite all the work done and the implementation of all the above business tasks, this project has the potential for further development and implementation of new functionalities that expand its capabilities. At this point in the project's development, such features include creating a responsive end-user interface that would allow the web version of the app to be used on different devices with different screen extensions, as well as connecting to a payment system such as Stripe.

# Annexes

User login workflow with multi-factor authentication and interoperability of all application infrastructure elements.

| ![Annex1.png](static/Annex1.png) | 
|:--:| 
| *Annex 1. User login workflow. Source: own work* |

---

<p align="center">
    <b>Mikhail Bahdashych (c) 2024</b>
</p>
