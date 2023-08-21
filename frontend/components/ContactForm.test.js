import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);

        const header = screen.getByText(/contact form/i);
        
        expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    
        const firstNameBox = screen.getByTestId("firstNameBox");
        
        userEvent.type(firstNameBox, 'abc');

        expect(screen.getByTestId("error")).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

        const submit = screen.getByRole('button');
        
        userEvent.click(submit);

        expect(screen.queryAllByTestId("error")).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    
        const firstNameBox = screen.getByTestId('firstNameBox');
        const lastNameBox = screen.getByTestId('lastNameBox');
        
        userEvent.type(firstNameBox, 'Robert');
        userEvent.type(lastNameBox, 'Smith');
        userEvent.click(screen.getByRole('button'));

        expect(screen.queryAllByTestId("error")).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

        const firstNameBox = screen.getByTestId('firstNameBox');
        const lastNameBox = screen.getByTestId('lastNameBox');
        const emailBox = screen.getByTestId('emailBox');

        userEvent.type(firstNameBox, 'Robert');
        userEvent.type(lastNameBox, 'Smith');
        userEvent.type(emailBox, 'asdf');

        expect(screen.queryAllByTestId("error")).toHaveLength(1);
        expect(screen.queryByTestId("error")).toHaveTextContent(/email must be a valid email address/i);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
        render(<ContactForm/>);

            const firstNameBox = screen.getByTestId('firstNameBox');
            const emailBox = screen.getByTestId('emailBox');

            userEvent.type(firstNameBox, 'Robert');
            userEvent.type(emailBox, 'dt@dt.com');
            userEvent.click(screen.getByRole('button'));

            expect(screen.queryAllByTestId("error")).toHaveLength(1);
            expect(screen.queryByTestId("error")).toHaveTextContent(/lastName is a required field./i);
    });

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

        const firstNameBox = screen.getByTestId('firstNameBox');
        const lastNameBox = screen.getByTestId('lastNameBox');
        const emailBox = screen.getByTestId('emailBox');

        userEvent.type(firstNameBox, 'Robert');
        userEvent.type(lastNameBox, 'Smith');
        userEvent.type(emailBox, 'RobSmith@email.com');
        userEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('firstnameDisplay')).toBeTruthy();
        expect(screen.getByTestId('lastnameDisplay')).toBeTruthy();
        expect(screen.getByTestId('emailDisplay')).toBeTruthy();
        expect(screen.queryByTestId('messageDisplay')).toBeNull();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameBox = screen.getByTestId('firstNameBox');
    const lastNameBox = screen.getByTestId('lastNameBox');
    const emailBox = screen.getByTestId('emailBox');
    const messageBox = screen.getByTestId('messageBox');

    userEvent.type(firstNameBox, 'Robert');
    userEvent.type(lastNameBox, 'Smith');
    userEvent.type(emailBox, 'RobSmith@email.com');
    userEvent.type(messageBox, 'hello');
    userEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('firstnameDisplay')).toBeTruthy();
    expect(screen.getByTestId('lastnameDisplay')).toBeTruthy();
    expect(screen.getByTestId('emailDisplay')).toBeTruthy();
    expect(screen.queryByTestId('messageDisplay')).toBeTruthy();
});
