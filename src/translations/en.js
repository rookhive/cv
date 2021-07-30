import {
    webpackConfigClient,
    webpackConfigServer,
    graphQlAuthResolvers,
    reactSSRServer
} from './links'
import { getAge } from './helpers'

const AGE = getAge('September 8, 1992 00:00:00')

export default {
    OK: 'Ok',
    NEXT: 'Next',
    REBUILDING: 'Interface rebuilding',
    PROLOGUE: 'Prologue',
    PROLOGUE_DESCRIPTION: `
        Hi there! My name is Kirill, I'm ${AGE}, and here I have an interactive
        resume for the Junior Frontend Developer position. It would come in very
        useful if you had 5-7 minutes of free time.
    `,
    ABOUT: 'About me',
    PREHISTORY: 'Prehistory',
    PREHISTORY_STORY: `
        When I was a kid, I had a superpower to create any objects, not existed
        before: interstellar shuttles, space stations, whole cities. The only
        thing that could stop me was limited amount of LEGO details.
                                        |
        You are quite right: this is a story about how programming has become
        for me a constructor LEGO with infinite number of details of any shape,
        size, and color :)
                                        |
        I dived into the Web at the times when a table layout was an usual
        practice, tag &lt;font&gt; wasn't looked as a savage anachromism, and
        jQuery was a core of almost any website. Though with the last one is all
        stable..
                                        |
        The first significant textbook in my arms was Matt Zandstra's self-teach
        PHP5 manual. Denwer (and after - standard bundle PHP + MySQL + Apache)
        cluttered up my PC with training projects (if you allow me to name them
        so).
                                        |
        The violence against the PHP lasted until the moment I got a
        seven-hundred page AJAX textbook (now it causes a smile). So, my
        acquaintance with the world of JavaScript started with hacks like
        &lt;iframe&gt; and &lt;img&gt; for AJAX-request imitation.. However, a
        possibility to do the same thing in different ways only whipped up an
        interest.
                                        |
        There have been a lot of books and articles since that time. After years
        I found Node.js and deeply breathed out: the epoch of bicycle
        constructioning finished, cleared the way for learning libraries and
        frameworks.
                                        |
        It only remains to add, predicting a possible question, why am I still
        not even a Junior: programming has always been a hobby, relaxation, and
        creativity for me. But that's a completely different story :)
    `,
    EDUCATION_AND_EXPERIENCE: 'Education and commercial experience',
    EDUCATION_AND_EXPERIENCE_STORY: `
        To explain why by the age of ${AGE} I haven't got a higher education or
        any commercial programming experience... While most of HR-s are closing
        the current browser tab, I'll try.
                                        |
        It so happens, that only by now in my closest future plans is to get
        the higher education. Not to accept the concept of "crusts" is a
        honorable stuff, but not always justified in fact.
                                        |
        All human beings are different, in a different way understand themselves
        and what do they really need and want. That's the whole answer. Despite
        such an infantilism, I've always thought education as an extremely
        important part of a personality development, and have never stopped in
        that direction.
                                        |
        I've never thought about programming professionally, reasoning for
        myself the choise of simple primitive jobs by unwillingness to make one
        of my favourite activity and hobby a daily routine.
                                        |
        But I think, all is much simplier: the brain inclines to
        self-justification for saving resources, and in the deep of my mind I
        was just afraid of confessing to myself in a lack of knowledge and
        skills.
                                        |
        Times have changed, and my feelings too. There is a sort of adventurous 
        romance in that chasing a long time ago gone train; anyway, nobody
        still has explained me why it could be too late sometime.
    `,
    BLACK_THOUGHTS: [
        'Industrial Zone "Bright Future"',
        'Old People\'s Home "Shaking Crucian"',
        'Labor Exchange "Where The Hell Are You?!"',
        `Drama Theatre. Tragicomedy "${AGE}-year-old Junior"`,
        'Church of Scientology "Hope Exists"'
    ],
    NON_COMMERCIAL_EXPERIENCE: 'Non-commercial experience',
    NON_COMMERCIAL_EXPERIENCE_INTRO: `
        Despite the total absence of commercial programming experience, in
        different periods of my life I wrote a lot for myself:
    `,
    NON_COMMERCIAL_EXPERIENCE_LIST: `
          Websites on PHP + MySQL
        | VanillaJS applications
        | React + Redux applications
        | MERN SPA + SSR
        | Web Extensions
        | Bots for browser games
    `,
    NON_COMMERCIAL_EXPERIENCE_OUTRO: `
        Some code examples will be in the Skills section.
    `,
    SKILLS: 'Skills',
    SKILLS_GREETING: `
        Click the technology you are interested in to view the detailed
        information
    `,
    REASONS: 'Why me',
    REASONS_YOU: 'You',
    REASONS_YOU_CONTENT: `
        {li:Are looking for a person, who is involved into the web-development
            and constantly increases and deepens his knowledge}
        {li:Give priority to employee's knowledge and desire for professional
            growth over diplomas and commercial experience}
        {li:Ready to hire a Junior, who is probably older than your Seniors :)}
    `,
    REASONS_I: 'I',
    REASONS_I_CONTENT: `
        {li:Am used to programming a lot, ready for any amount of work,
            including overtime}
        {li:Absolutely non-conflict person; calmly accept even harsh but
            objective criticism}
        {li:Actively self-teching. Don't ask stupid questions or feel shy
            to ask smart ones}
        {li:Don't have any pernicious habits}
    `,
    EPILOGUE: 'Epilogue',
    EPILOGUE_THATS_ALL: 'So it goes.',
    EPILOGUE_MESSAGE: `
        {p:I'm not good at what Junior CVs should look like, but I hope I was
            able to voice some of important to me things in a relaxed manner.}
        {p:And thanks for your time!}
    `,
    EPILOGUE_SOURCE: 'Source code for this resume',
    EPILOGUE_SOCIAL: 'Some good music',
    TECH_FRONTEND: 'Frontend',
    TECH_BACKEND: 'Backend',
    TECH_OTHER: 'Other',
    TECH_TITLE_OOP: 'OOP',
    TECH_TITLE_LAY: 'CSS layout',
    TECH_JS: `
        {p:Know better than any other language or technology. I keep track of
            ECMAScript standards and use new features as soon as support is
            available in Babel. Clearly understand things like:}
        {li:Event loop}
        {li:Prototype chain, execution context, inheritance, closures etc.}
        {li:Asynchronicity, iterators, any built-in objects and methods}
        {p:This interactive CV is written in pure JavaScript without any
            dependencies.}
    `,
    TECH_PSD: `
        {p:Know on the level of cutting images (or SVG) from PSD templates. 
            Thank god, it isn't needed for anything else in the frontend
            development.}
        {li:Use Zeplin for more comfortable layout}
    `,
    TECH_DOM: `
        {li:Freely navigate the DOM without any libraries}
        {li:Know the difference between HTMLCollection and JavaScript-array :)}
        {li:Will quickly start working with any DOM/CSSOM objects}
    `,
    TECH_CSS: `
        {p:Made round corners yet in IE with CSS3PIE :)}
        {li:Use the most of features in CSS: any selectors, pseudo-elements,
            pseudo-classes, media queries, animation, transitions, transforms,
            css-vars and so on}
    `,
    TECH_LAY: `
        {li:Know how to create adaptive layout of any complexity from table
            layout for emails to flexbox}
        {li:Think in the Mobile First paradigm}
        {li:Use tags as intended to enhance semantics}
        {li:Make cross-browser layout if it needed. This CV, for example, will
            not work even in IE11, bacause the evil has to be eliminated}
        {li:Use BEM-methodology for the CSS-classes naming}
    `,
    TECH_REACT: `
        {p:Use frequently and intensively. Understand the mechanism of work,
            components lifecycle, hooks.}
        {li:Worked with react-loadable и loadable-components, react-router,
            react-helmet}
        {li:Understand, how does the server rendering works with Redux and code
            splitting. <a href="${reactSSRServer}" target="_blank">An example
            of usage</a> redux-saga + loadable components with SSR}
    `,
    TECH_REDUX: `
        {p:Use with React only.}
        {li:Know the principles and the mechanism of work. Clearly understand
            what are the reducers, actions, selectors, usage with React hooks,
            etc.}
        {li:Worked with redux-thunk and redux-saga}
    `,
    TECH_WEXT: `
        {p:Understand, how do browser extensions work. What a manifest is,
            what background and content scripts are needed for, etc.}
        {p:Used web-extensions long enough - they turned out to be pretty
            convinient as an interface of the bot (for a browser online game),
            because that approuch provided a reduced probability of their
            detection :)}
        {li:Familiar with the Web Extension API and differences between FF and
            Chrome extensions}
        {li:Use web-ext for development}
    `,
    TECH_WANIM: `
        {p:Originally I used the Web Animations API because of its flexibility
            and performance, but the polyfill in the old iOS Safari had a leak
            that had greatly complicated the development process, and which I,
            of course, have preferred not to search for. Understand:}
        {li:Web Animations API}
        {li:Features of browser animation, things like reflow/repaint, and how
            to improve browser animation rendering}
        {li:How to do animations in pure JavaScript (and why it is better not
            to), CSS animations, using CSS transitions + JavaScript (as in this
            CV)}
    `,
    TECH_SVG: `
        {p:Didn't work closely with libraries like D3, but I understand what
            they are cappable of, and know SVG on the sufficient level for the
            quick start.}
        {p:All images in this CV (exept github and vk icons) are written in SVG
            manually with code, as I'm not a designer and in my case it turned
            out to be much more easier and faser.}
    `,
    TECH_SASS: `
        {p:I have an expirience of working with LESS, but actively use SASS.
            However, CSS preprocessors are extremely similar in syntax and
            functionality.}
        {li:Know it on the level of mixins, inheritance, functions, loops}
    `,
    TECH_UIX: `
        I've added this item here not because of great faith in my abilities,
        but of huge love in interfaces inventing. Try them to be clearly 
        understandable and convinient since first user experience.
    `,
    TECH_JQRY: `
        jQuery is being prophesied oblivion for many years, nonetheless I
        understand how it works and how to write a library with a similar
        interface and functionality.
    `,
    TECH_NODE: `
        {p:Understand how it works; some features. Familiar with built-in
            objects and modules. In other this is a usual JavaScript, which I
            know pretty well.}
        {li:Use Express as a webserver}
    `,
    TECH_GRQL: `
        {p:Understand core principles, know on the base level.}
        {li:Use express-graphql}
        {li:<a href="${graphQlAuthResolvers}" target="_blank">Resolvers</a> for
            a simple user authentication}
    `,
    TECH_REST: `
        Understand the requirements for architecrure, know how to write RESTful
        API using Express.
    `,
    TECH_HTTP: `
        {p:Know on the level of headers, methods, request structure.}
        {li:Use Postman for debugging}
    `,
    TECH_SQL: `
        {p:Know on the level of JOIN and GROUP, understand what are indexes and
            transactions. Understand the difference between relational and
            non-relational DBMS and difference in building an architecture in
            them.}
        {li:Worked with MySQL and MongoDB (ODM Mongoose)}
    `,
    TECH_JWT: `
        Familiar with the standard, understand how it works. Worked with
        the library Jsonwebtoken for users authentication (together with Redis,
        for controlling valid tokens after logout)
    `,
    TECH_BUND: `
        {p:Use Webpack frequently. A pair of examples: for
            <a href="${ webpackConfigClient}" target="_blank">client</a> and
            <a href="${webpackConfigServer}" target="_blank">server</a>
            side of a website on React + SSR}
        {p:Know Gulp on the base level and use basicly for SASS bundling}
    `,
    TECH_GIT: `
        To be honest, it is difficult to imagine a process of programming
        without VCS even on amateur level. Use Git through the command line
        interface. But things like branch merging and more complex stuff, I do
        only with the documentation, because if you don't work in a team,
        something complicated in that direction is needed really rarely.
    `,
    TECH_OOP: `
        {p:I'm interested in functional programming, things like currying,
            recursion everywhere and pure-functons (and libraries like Ramda),
            but I think the object-oriented paradigm is the best approuch even
            for a language like JavaScript.}
        {li:Studied everything I found about algorithms, design patterns,
            architecture, etc.}
        {li:Familiar with the SOLID principles and things like KISS, DRY, YAGNI}
        {li:Familiar with the GRASP patterns, try to follow them}
    `,
    TECH_ENG: `
        Intermediate level. I pretty easily read technical literature and
        documentation, listen to developer conferences, and so on.
    `
}