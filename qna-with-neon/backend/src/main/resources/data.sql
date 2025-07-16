-- Insert sample users
INSERT INTO member (nickname, email, password) VALUES
('Asahi', 'Asahi@ex1.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.'),
('Riku', 'Riku@ex2.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.'),
('ys', 'ys@ex3.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.')
ON CONFLICT (nickname) DO NOTHING;

-- Insert sample questions
INSERT INTO questions (title, content, member_id, view_count, like_count, created_at) VALUES
(
  'How to implement JWT authentication in Spring Boot?', 
  'I am trying to implement JWT authentication in my Spring Boot application. What are the best practices and how should I structure the security configuration?', 
  1,     
  45,     
  0,      
  CURRENT_TIMESTAMP - INTERVAL '2 days'
);


('What is the difference between @Component and @Service in Spring?', 
 'I have seen both @Component and @Service annotations used in Spring applications. What is the actual difference between them and when should I use each one?', 
 'spring,annotations,component,service', 
 2, 
 3, 
 CURRENT_TIMESTAMP - INTERVAL '1 day'),

('How to handle database transactions in Spring Boot?', 
 'I need to understand how to properly handle database transactions in Spring Boot. Should I use @Transactional annotation and what are the best practices?', 
 'spring-boot,database,transactions,jpa', 
 3, 
 4, 
 CURRENT_TIMESTAMP - INTERVAL '3 hours'),



-- Insert sample votes
INSERT INTO votes (vote_type, user_id, answer_id, created_at) VALUES
('UPVOTE', 2, 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('UPVOTE', 3, 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('UPVOTE', 4, 1, CURRENT_TIMESTAMP - INTERVAL '23 hours'),
('UPVOTE', 2, 2, CURRENT_TIMESTAMP - INTERVAL '19 hours'),
('UPVOTE', 3, 2, CURRENT_TIMESTAMP - INTERVAL '18 hours'),
('UPVOTE', 1, 3, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('UPVOTE', 3, 3, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('UPVOTE', 2, 4, CURRENT_TIMESTAMP - INTERVAL '4 days'),
('UPVOTE', 3, 4, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('UPVOTE', 4, 4, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('UPVOTE', 1, 5, CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
('UPVOTE', 2, 5, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
('UPVOTE', 3, 5, CURRENT_TIMESTAMP - INTERVAL '15 minutes')
ON CONFLICT (user_id, answer_id) DO NOTHING;
