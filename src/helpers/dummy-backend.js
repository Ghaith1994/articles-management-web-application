let users = JSON.parse(localStorage.getItem('users')) || [];

let articles = JSON.parse(localStorage.getItem('articles')) || [];
    
export function configureDummyBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    let params = JSON.parse(opts.body);

                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                    } else {
                        reject('Username or password is incorrect');
                    }

                    return;
                }

                // register user
                if (url.endsWith('/users/register') && opts.method === 'POST') {
                    let newUser = JSON.parse(opts.body);

                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        reject('Username "' + newUser.username + '" is already taken');
                        return;
                    }

                    newUser.id = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    resolve({ ok: true, text: () => Promise.resolve() });

                    return;
                }


                // get articles
                if (url.endsWith('/articles') && opts.method === 'GET') {
                    if (opts.headers ) {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(articles))});
                    } else {
                        reject('Unauthorised');
                    }

                    return;
                }

                // store article
                if (url.endsWith('/articles') && opts.method === 'POST') {
                    if (opts.headers  ) {
                        let newArticle = JSON.parse(opts.body);
                        newArticle.id = articles.length ? Math.max(...articles.map(article => article.id)) + 1 : 1;
                        articles.push(newArticle);
                        localStorage.setItem('articles', JSON.stringify(articles));

                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(articles))});
                    } else {
                        reject('Unauthorised');
                    }

                    return;
                }

                // delete article
                if (url.match(/\/articles\/\d+$/) && opts.method === 'DELETE') {
                    if (opts.headers ) {
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < articles.length; i++) {
                            let article = articles[i];
                            if (article.id === id) {
                                articles.splice(i, 1);
                                localStorage.setItem('articles', JSON.stringify(articles));
                                break;
                            }
                        }

                        resolve({ ok: true, text: () => Promise.resolve() });
                    } else {
                        reject('Unauthorised');
                    }

                    return;
                }

                // update article
                if (url.match(/\/articles\/\d+$/) && opts.method === 'PUT') {
                    if (opts.headers ) {
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < articles.length; i++) {
                            let article = articles[i];
                            if (article.id === id) {
                                let newArticle = JSON.parse(opts.body);
                                articles[i] = newArticle;
                                localStorage.setItem('articles', JSON.stringify(articles));
                                break;
                            }
                        }

                        resolve({ ok: true, text: () => Promise.resolve() });
                    } else {
                        reject('Unauthorised');
                    }

                    return;
                }

                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}