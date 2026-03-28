import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is missing. Email will not be sent.');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Golf Clarity <noreply@golfclarity.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Email utility error:', error);
    throw error;
  }
};

export const templates = {
  drawResults: (month: string) => `
    <h1>Draw Results for ${month}</h1>
    <p>The latest draw results have been published! Check your performance protocols to see your impact and potential winnings.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings">View Results</a>
  `,
  winnerAlert: (amount: number) => `
    <h1>Protocol Alert: You have won!</h1>
    <p>Congratulations! You have been identified as a winner in the latest draw. Your prize share is **${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}**.</p>
    <p>Please log in to your dashboard to provide performance verification (scorecard upload) to claim your impact.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings">Claim Payout</a>
  `,
};
