var Flight = {
    id : 0,
    account_id: 0,
    campaign_id: 0,
    network_id: 0,
    user_id: 0,
    name: "",
    priority: 0,
    balance: 0.0,
    spent: 0.0,
    budget: 0.0,
    distribution: "",
    begin: 0,
    end: 0,
    state: "",
    comment: 0,

    limit: {
        overall: {
            click: {
                day: 100,
                all: 3000
            },

            exposure: {
                day: 1000,
                all: 5000
            }
        },

        user : {
            click: {
                all: 2,
                interval: 3600
            },

            exposure: {
                all: 5,
                interval: 600
            },

            period : {
                click: {
                    count: 1,
                    interval: 3600
                },

                exposure: {
                    count: 30,
                    interval: 3600
                }
            }
        }
    }
};