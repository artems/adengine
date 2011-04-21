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
    limit : {
        day: {
            user: {
                click: 0,
                exposhure: 0
            },
            all: {
                click: 0,
                exposhure: 0
            }
        },
        week: {
            user: {
                click: 0,
                exposhure: 0
            },
            all: {
                click: 0,
                exposhure: 0
            }
        },
        month: {
            user: {
                click: 0,
                exposhure: 0
            },
            all: {
                click: 0,
                exposhure: 0
            }
        },
        total: {
            user: {
                click: 0,
                exposhure: 0
            },
            all: {
                click: 0,
                exposhure: 0
            }
        },
        interval : {
            click: 0,
            exposhure: 0
        }
    }
};