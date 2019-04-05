# dns-audit

Node console app to run dig for each domain in a list of domains and compare the results to the previous run. It assumes a Unix-like environment (tested on Mac OSX and RHEL.) It can also send an email combining reports generated since the last email was sent. The email function assumes the presence of the Unix 'mail' command, configured to send email via a Mail Transfer Agent like Postfix or Sendmail. (If executing `mail -s 'test' address@example.com` doesn't work, it will not be able to send emails.)

## Differences

The app looks for changes in the values for DNS records of specified types for each domain. It does this by extracting the values from the answer section of the dig output. Ie, if the first dig contained two A records and one CNAME record, the second dig must contain two A records and one CNAME record, with the same values for A records and for the CNAME record. The order of the records in the dig output does not matter.

## Installation

Install [Node JS](https://nodejs.org/en/download/package-manager/) if it is not installed already. Preferably v11, but v10 will probably work.

Clone the repository.

    git clone https://github.com/lraulin/dns-audit/tree/v1.1.3

Install dependencies.

    cd dns-audit
    npm install

Install the app globally

    sudo npm install -g

The command 'dns-audit' should now be available for all users. If not, it can be called with /usr/bin/dns-audit

## Data Directory

The app uses a data directory in /usr/local/share/dns-audit, where it stores its data in a sqlite3 database file, as well as log files. (This can be changed to a different directory by changeing the value of "data_path" in the config.json file in the src folder.) This ensures the data will not change if the app if updated or removed, and if installed by a different user, it will use the same data. It will attempt to create this directory if it does not exist. However, user permissions may cause problems. If so, create the directory manually if necessary, and make sure the current user has read-write permissions for it.

## Usage

    dns-audit -d

This will run the dig command for all domains, store the results, and compare them to the last run, storing the results of the comparison to the database.

    dns-audit -m

This command retrieves the time the last email was sent from the database, fetches the summary reports (generated every time the app is called with the -d flag) since that time, concatenates them, prepends an overall summary, sends the message to the email(s) listed in the 'emails' key in config.json, and records time the email was sent in the database.

    dns-audit -t

For debugging. This generates the email that would be sent, and emails it to the configured 'dev_emails', but does not record the time (so it will not affect the message generated next time the -m flag is used).

## Automating

The app is meant to be automated with cron. Create a cron job with `crontab -e` and add the following:

    0   *   *   *   *   sudo /usr/bin/dns-audit -d
    30   8   *   *   *   sudo /usr/bin/dns-audit -m

The first line makes it check DNS records every hour. The second line schedules an email to be sent every day at 8:30am. Sudo can be omitted if the cron job has necessary privileges.

## Configuration

Settings are in config.json in the src folder. The email lists used for messages and for the debugging test message can be set with 'emails' and 'dev_emails' respectively. Emails should be given as an array of strings. The data directory can be set with 'data_path'.

Currently, the lists of record types and domains can only be changed by interacting with the database. I might change it to read them from the config file, but that will take refactoring. If you know sqlite, you interact with the database file at the command line by executing `sqlite3 /usr/local/share/dns-audit/data.db`. The file can also be examined and modified graphically with [DB Browser for SQLite](https://sqlitebrowser.org/), but obviously not on the server.
